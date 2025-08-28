import { prisma } from "@/src/lib/prisma"

export async function POST(req: Request) {
  const { appId, theme, color, fontHeading, fontBody } = await req.json()
  // store theme on OnePager; store style tokens on AssetPack
  const app = await prisma.app.findUnique({ where: { id: appId }, include: { onepager:true, assets:true }})
  if (!app) return new Response("Not found", { status: 404 })
  if (!app.onepager) {
    await prisma.onePager.create({ data: { appId, theme: theme || "clean", path: `/apps/${app.slug}`, published: true } })
  } else {
    await prisma.onePager.update({ where: { appId }, data: { theme: theme || "clean", path: `/apps/${app.slug}`, published: true } })
  }
  if (!app.assets) {
    await prisma.assetPack.create({ data: { appId, colorAccent: color || "#4f46e5", fontHeading: fontHeading || "Inter, system-ui, sans-serif", fontBody: fontBody || "Inter, system-ui, sans-serif" } })
  } else {
    await prisma.assetPack.update({ where: { appId }, data: { colorAccent: color || app.assets.colorAccent || "#4f46e5", fontHeading: fontHeading || app.assets.fontHeading || "Inter, system-ui, sans-serif", fontBody: fontBody || app.assets.fontBody || "Inter, system-ui, sans-serif" } })
  }
  return Response.json({ ok: true })
}
