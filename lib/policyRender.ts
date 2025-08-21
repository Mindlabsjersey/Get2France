import { marked } from "marked"
const pdf = require("html-pdf-node")
export function renderPolicyMd(json: any): string {
  const lines: string[] = []
  lines.push(`# ${json.title || "Privacy Policy"}`)
  lines.push(`_Last updated: ${json.lastUpdated || ""}_`)
  lines.push(`\n**Controller:** ${json.controller?.name||""}  \nContact: ${json.controller?.email||""}\n`)
  if (json.summary) lines.push(`> ${json.summary}\n`)
  lines.push(`## Scope & Jurisdictions\n${(json.jurisdictions||[]).join(", ")}`)
  lines.push(`\n## Data We Collect\n${(json.dataCategories||[]).map((d:string)=>`- ${d}`).join("\n")}`)
  lines.push(`\n## Processors`)
  for (const p of (json.processors||[])) lines.push(`- **${p.name}** — ${p.purpose||""}`)
  lines.push(`\n## Your Rights`)
  for (const r of (json.rights||[])) lines.push(`- **${r.name}** — ${r.description}`)
  lines.push(`\n## Retention\n${json.retention?.policy || ""} (typically ${json.retention?.months||""} months)`)
  lines.push(`\n## Contact\nEmail: ${json.contact?.email||""}`)
  for (const s of (json.sections||[])) lines.push(`\n## ${s.heading}\n${s.body}`)
  return lines.join("\n")
}
export function renderPolicyHtml(json:any): string {
  const md = renderPolicyMd(json)
  const body = marked.parse(md)
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${json.title || "Privacy Policy"}</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;line-height:1.6;color:#0f172a;padding:24px;max-width:860px;margin:0 auto;}
h1,h2,h3{color:#0b1220} blockquote{background:#f8fafc;border-left:4px solid #e2e8f0;padding:12px 16px}</style>
</head><body>${body}</body></html>`
}
export async function htmlToPdf(html: string, outPath: string) {
  const file = { content: html }
  const options = { format: "A4", margin: { top:"16mm", left:"16mm", right:"16mm", bottom:"16mm" } }
  await new Promise<void>((resolve, reject) =>
    pdf.generatePdf(file, options).then((buf: Buffer) => {
      import("fs/promises").then(fs => fs.writeFile(outPath, buf)).then(()=>resolve()).catch(reject)
    }).catch(reject)
  )
}
