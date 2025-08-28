import { prisma } from "@/src/lib/prisma"
import { NextRequest } from "next/server"
export async function GET() {
  const items = await prisma.app.findMany({ orderBy: { createdAt: "desc" }})
  return Response.json({ items })
}
export async function POST(req: NextRequest) {
  const { name, url, platform } = await req.json()
  const slug = (name||"app").toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Math.random().toString(36).slice(2,6)
  const user = await prisma.user.upsert({ where:{ email:"founder@example.com" }, update:{}, create:{ email:"founder@example.com", name:"Founder" }})
  const app = await prisma.app.create({ data: { name, url, platform: platform||"WEB", slug, userId: user.id }})
  return Response.json({ app })
}
