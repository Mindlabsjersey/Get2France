import { prisma } from "@/src/lib/prisma"
import OpenAI from "openai"
import { connection } from "./queue"
import { Worker } from "bullmq"
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
async function generateListing({ appId }:{ appId:string }) {
  const app = await prisma.app.findUnique({ where: { id: appId }, include: { pages: true }})
  if (!app) return
  const features = (app.pages||[]).flatMap(p=>{
    const t = p.title ? `Page: ${p.title}. ` : ""
    const lbl = JSON.stringify((p.annotations||[]).slice(0,3))
    return [`${t}UI hints: ${lbl}`]
  }).slice(0,8).join("\n")
  const sys = `You are an ASO copywriter. Write App Store & Google Play compliant text.`
  const user = `App name: ${app.name}
Platform: ${app.platform}
Key features:
${features}
Return STRICT JSON:
{ "tagline":"max 30 chars","shortDesc":"≤80 chars","fullDesc":"≤4000 chars","keywords":"comma list" }`
  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [{ role:"system", content: sys }, { role:"user", content: user }]
  })
  const primary = JSON.parse(r.choices[0].message.content||"{}")
  await prisma.storeListing.upsert({
    where:{ appId: app.id },
    create:{ appId: app.id, tagline: primary.tagline||app.name, shortDesc: primary.shortDesc||"", fullDesc: primary.fullDesc||"", keywords: primary.keywords||"" },
    update:{ tagline: primary.tagline||app.name, shortDesc: primary.shortDesc||"", fullDesc: primary.fullDesc||"", keywords: primary.keywords||"" }
  })
}
new Worker("pipeline", async job => { if (job.name !== "generateListing") return; await generateListing(job.data) }, { connection })
export default generateListing
