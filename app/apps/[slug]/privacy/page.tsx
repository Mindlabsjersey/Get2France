import { prisma } from "@/src/lib/prisma"
import fs from "fs/promises"
export default async function Privacy({ params }:{ params:{ slug:string }}) {
  const app = await prisma.app.findUnique({ where:{ slug: params.slug }, include: { legalDocs: true } as any })
  const docs = (app as any)?.legalDocs?.filter((d:any)=>d.kind==="PRIVACY") || []
  const doc = docs.find((d:any)=>d.status==="PUBLISHED") || docs.sort((a:any,b:any)=>a.generatedAt<b.generatedAt?1:-1)[0]
  if (!doc) return <div className="p-6">No privacy policy yet.</div>
  const html = await fs.readFile("public/"+doc.htmlKey, "utf8")
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
