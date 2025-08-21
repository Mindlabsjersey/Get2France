import { prisma } from "../lib/prisma";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";

type CrawlOpts = { appId: string; maxPages?: number };
export default async function crawlApp({ appId, maxPages = 6 }: CrawlOpts) {
  const app = await prisma.app.findUnique({ where: { id: appId } });
  if (!app?.url) throw new Error("No URL to crawl");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(app.url, { waitUntil: "networkidle2", timeout: 90_000 });

  const links: string[] = await page.$$eval(
    "a[href]",
    as => Array.from(new Set(as.map(a => (a as HTMLAnchorElement).href))).slice(0, maxPages)
  );
  const targets = [app.url, ...links].slice(0, maxPages);

  let orderIndex = 0;
  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  for (const target of targets) {
    try {
      await page.goto(target, { waitUntil: "networkidle2", timeout: 60_000 });

      const domJson = await page.evaluate(() => {
        function extract(el: Element, depth = 0): any {
          if (depth > 3) return null;
          const role = (el.getAttribute("role") || "").toLowerCase();
          const tag = el.tagName.toLowerCase();
          const text = (el as HTMLElement).innerText?.trim().slice(0, 120) || "";
          const cls = (el.getAttribute("class") || "").split(/\s+/).slice(0, 4);
          const kids = Array.from(el.children)
            .slice(0, 6)
            .map(c => extract(c, depth + 1))
            .filter(Boolean);
          return { tag, role, cls, text, kids };
        }
        return extract(document.body);
      });

      const ts = Date.now();
      const base = path.join(uploadDir, `${app.id}-${ts}-${orderIndex}`);
      await page.screenshot({ path: `${base}-fold.png` });
      await page.screenshot({ path: `${base}-full.png`, fullPage: true });

      await prisma.page.create({
        data: {
          appId: app.id,
          url: target,
          title: await page.title(),
          orderIndex,
          domJson,
          screenshotKey: path.relative(process.cwd(), `${base}-fold.png`)
        }
      });
      orderIndex++;
    } catch (e) {
      console.error("crawl error", e);
    }
  }

  await browser.close();
}
