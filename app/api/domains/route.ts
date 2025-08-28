import { prisma } from "@/src/lib/prisma"
import { addDomain, getConfig } from "@/src/lib/vercelDomains"
export async function POST(req:Request) {
  const { appId, hostname } = await req.json()
  const added = await addDomain(hostname)
  const cfg = await getConfig(hostname)
  const rec = await prisma.domainMap.create({ data: { appId, hostname, provider:"vercel", status:"verifying" }})
  return Response.json({ domain: rec, instructions: cfg })
}
