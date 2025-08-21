import { prisma } from "@/src/lib/prisma"
import { connection } from "./queue"
import { Worker } from "bullmq"
import OpenAI from "openai"
import { renderPolicyHtml, renderPolicyMd, htmlToPdf } from "@/lib/policyRender"
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
async function generatePrivacy({ appId, locale = "en-US" }:{ appId:string, locale?:string }) {
  const app = await prisma.app.findUnique({ where: { id: appId }, include: { user: true }})
  if (!app) return
  const defaults = {
    companyName: app.user.businessName || app.name,
    contactEmail: "support@example.com",
    jurisdiction: ["GDPR","CCPA"],
    dataCollected: ["account","usage","analytics","cookies"],
    processors: Array.from(new Set([ ...(((app.meta as any)?.detectedVendors)||[]), "Stripe" ])),
    retentionMonths: 24,
    locale
  }
  const sys = `You generate privacy policies for apps. Return STRICT JSON with fields:
title,lastUpdated,controller,summary,sections[],jurisdictions[],dataCategories[],processors[],rights[],contact,retention`
  const user = `App: ${app.name}
Detected processors: ${JSON.stringify(defaults.processors)}
Data collected: ${JSON.stringify(defaults.dataCollected)}
Jurisdictions: ${JSON.stringify(defaults.jurisdiction)}
Contact: ${defaults.contactEmail}
Retention (months): ${defaults.retentionMonths}
Locale: ${locale}`
  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.1,
    messages: [{ role:"system", content: sys }, { role:"user", content: user }]
  })
  const json = JSON.parse(r.choices[0].message.content || "{}")
  const html = renderPolicyHtml(json)
  const md   = renderPolicyMd(json)
  const ts   = Date.now()
  const base = `public/uploads/legal/${app.id}-privacy-${ts}`
  const htmlKey = `${base}.html`, mdKey = `${base}.md`, pdfKey = `${base}.pdf`
  await (await import("fs/promises")).mkdir("public/uploads/legal",{recursive:true})
  await (await import("fs/promises")).writeFile(htmlKey, html, "utf8")
  await (await import("fs/promises")).writeFile(mdKey, md, "utf8")
  await htmlToPdf(html, pdfKey)
  await prisma.legalDoc.create({
    data: { appId: app.id, kind: "PRIVACY", version: 1, locale, status: "DRAFT",
      htmlKey: htmlKey.replace(/^public\//,""), mdKey: mdKey.replace(/^public\//,""), pdfKey: pdfKey.replace/^public\//,""),
      generatedAt: new Date(), inputs: defaults as any
    }
  })
}
new Worker("pipeline", async job => { if (job.name !== "generatePrivacy") return; await generatePrivacy(job.data) }, { connection })
export default generatePrivacy
