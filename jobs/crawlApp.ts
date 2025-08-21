import { prisma } from "@/src/lib/prisma"
import { pipelineQueue, connection } from "./queue"
import { Worker } from "bullmq"
import puppeteer from "puppeteer"
import fs from "fs/promises"

async function crawlApp({ appId, maxPages = 6 }:{ appId:string, maxPages?:number }) {
  const app = await prisma.app.findUnique({ where: { id: appId }})
  if (!app?.url) return
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const seenHosts = new Set<string>()
  page.on("request", req => { try { seenHosts.add(new URL(req.url()).hostname) } catch {} })

  await page.goto(app.url, { waitUntil: "networkidle2", timeout: 90000 })
  const links: string[] = await page.$$eval("a[href]", as => Array.from(new Set(as.map(a => (a as HTMLAnchorElement).href))).slice(0, 12))
  const targets = [app.url, ...links].slice(0, maxPages)
  let orderIndex = 0
  await fs.mkdir("public/uploads", { recursive: true })
  for (const target of targets) {
    try {
      await page.goto(target, { waitUntil: "networkidle2", timeout: 60000 })
      const domJson = await page.evaluate(() => {
        function extract(el: Element, depth = 0): any {
          if (depth > 3) return null
          const role = (el.getAttribute("role") || "").toLowerCase()
          const tag = el.tagName.toLowerCase()
          const text = (el as HTMLElement).innerText?.trim().slice(0, 160) || ""
          const cls = (el.getAttribute("class") || "").split(/\s+/).slice(0, 4)
          const kids = Array.from(el.children).slice(0, 6).map(c => extract(c, depth+1)).filter(Boolean)
          return { tag, role, cls, text, kids }
        }
        return extract(document.body)
      })
      const ts = Date.now()
      const base = `public/uploads/${app.id}-${ts}-${orderIndex}`
      await page.screenshot({ path: `${base}-fold.png` })
      await page.screenshot({ path: `${base}-full.png`, fullPage: true })
      await prisma.page.create({
        data: {
          appId: app.id,
          url: target,
          title: await page.title(),
          orderIndex,
          domJson,
          screenshotKey: `${base}-fold.png`.replace(/^public\//,"")
        }
      })
      orderIndex++
    } catch (e) { console.error("crawl error", e) }
  }
  await browser.close()
  const KNOWN_VENDORS: Record<string,string> = {
    "www.google-analytics.com": "Google Analytics",
    "analytics.google.com": "Google Analytics",
    "plausible.io": "Plausible",
    "cdn.segment.com": "Segment",
    "js.stripe.com": "Stripe",
    "connect.facebook.net": "Meta Pixel",
    "www.googletagmanager.com": "Google Tag Manager",
    "cdn.posthog.com": "PostHog",
    "cdn.cloudflare.com": "Cloudflare"
  }
  const matched = [...seenHosts].map(h => KNOWN_VENDORS[h]).filter(Boolean)
  await prisma.app.update({
    where: { id: app.id },
    data: { status: "PROCESSING", meta: { ...(app.meta as any||{}), detectedVendors: matched } }
  })
}
new Worker("pipeline", async job => { if (job.name !== "crawlApp") return; await crawlApp(job.data) }, { connection })
export default crawlApp
