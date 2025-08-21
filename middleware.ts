import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/src/lib/prisma"
export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || ""
  const primary = process.env.PUBLIC_PRIMARY_DOMAIN || "localhost:3000"
  if (host === primary) return NextResponse.next()
  const map = await prisma.domainMap.findUnique({ where: { hostname: host }, include: { app: true }})
  if (map?.status === "active" && map.app?.slug) {
    const url = req.nextUrl.clone()
    url.pathname = `/apps/${map.app.slug}`
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}
export const config = { matcher: ["/((?!_next|api|static|uploads|favicon.ico).*)"] }
