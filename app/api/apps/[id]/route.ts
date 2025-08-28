import { prisma } from "@/src/lib/prisma"
export async function GET(_:Request, { params }:{ params:{ id:string }}) {
  const app = await prisma.app.findUnique({ where:{ id: params.id }, include:{ onepager:true, assets:true }})
  const pages = await prisma.page.findMany({ where:{ appId: params.id }, orderBy:{ orderIndex:"asc" }})
  return Response.json({ app, pages })
}
