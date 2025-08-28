import { prisma } from "@/src/lib/prisma"
import sharp from "sharp"
import { connection } from "./queue"
import { Worker } from "bullmq"
type Spec = { label: string, w: number, h: number }
const iosSpecs: Spec[] = [
  { label: "iphone-6_7", w: 1290, h: 2796 },
  { label: "iphone-6_5", w: 1242, h: 2688 }
]
const androidSpecs: Spec[] = [
  { label: "phone-1080x1920", w: 1080, h: 1920 },
  { label: "tablet-1600x2560", w: 1600, h: 2560 }
]
async function generateStoreScreens({ appId }:{ appId:string }) {
  const pages = await prisma.page.findMany({ where: { appId }, orderBy: { orderIndex: "asc" }})
  const firstFive = pages.slice(0,5)
  const makeSet = async (specs: Spec[]) => {
    const out:any[] = []
    for (let i=0;i<specs.length;i++) {
      const spec = specs[i]
      const p = firstFive[i % firstFive.length]
      if (!p?.screenshotKey) continue
      const input = "public/"+p.screenshotKey
      const output = input.replace(".png", `-${spec.label}.png`)
      await sharp(input).resize({ width: spec.w, height: spec.h, fit: "cover" }).toFile(output)
      out.push({ size: `${spec.w}x${spec.h}`, key: output.replace(/^public\//,"") })
    }
    return out
  }
  const ios = await makeSet(iosSpecs)
  const android = await makeSet(androidSpecs)
  await prisma.storeListing.update({ where: { appId }, data: { iosScreens: ios, androidScreens: android }})
}
new Worker("pipeline", async job => { if (job.name !== "generateStoreScreens") return; await generateStoreScreens(job.data) }, { connection })
export default generateStoreScreens
