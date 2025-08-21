import { addJob } from "@/jobs/queue"
export async function GET(req:Request) {
  const { searchParams } = new URL(req.url)
  const appId = searchParams.get("appId")!
  const step  = searchParams.get("step") || "full"
  if (step==="crawl")   await addJob("crawlApp",{appId})
  if (step==="wire")    await addJob("generateWireframes",{appId})
  if (step==="listing") await addJob("generateListing",{appId})
  if (step==="screens") await addJob("generateStoreScreens",{appId})
  if (step==="privacy") await addJob("generatePrivacy",{appId})
  return Response.json({ ok:true, queued: step })
}
