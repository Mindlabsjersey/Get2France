import { prisma } from "@/src/lib/prisma"
import { connection } from "./queue"
import { Worker } from "bullmq"
import sharp from "sharp"
import fs from "fs/promises"
async function generateWireframes({ appId }:{ appId:string }) {
  const pages = await prisma.page.findMany({ where: { appId }, orderBy: { orderIndex: "asc" }})
  for (const p of pages) {
    if (!p.screenshotKey) continue
    const input = "public/"+p.screenshotKey
    const output = input.replace("-fold.png","-wire.png")
    const buf = await sharp(input).grayscale().sharpen().threshold(180).toBuffer()
    await fs.writeFile(output, buf)
    const collectText = (n:any, arr:string[]=[]): string[] => { if (!n) return arr; if (n.text && n.text.length > 6) arr.push(n.text); (n.kids||[]).forEach((k:any)=>collectText(k, arr)); return arr }
    const texts = collectText(p.domJson).slice(0, 5)
    const labels = texts.map((t, i) => ({ x:24, y:40+i*28, w:600, h:20, label: t.slice(0,60)}))
    await prisma.page.update({ where: { id: p.id }, data: { wireframeKey: output.replace(/^public\//,""), annotations: labels }})
  }
}
new Worker("pipeline", async job => { if (job.name !== "generateWireframes") return; await generateWireframes(job.data) }, { connection })
export default generateWireframes
