import { prisma } from "@/src/lib/prisma"
export default async function AppPage({ params }:{ params:{ slug:string }}) {
  const app = await prisma.app.findUnique({ where:{ slug: params.slug }, include:{ listing:true, pages:true }})
  if (!app) return <div className="p-6">Not found</div>
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl p-6">
        <h1 className="text-4xl font-bold">{app.name}</h1>
        <p className="mt-2 text-lg text-zinc-600">{app.listing?.shortDesc}</p>
        <div className="mt-4 flex gap-2">
          <a className="px-4 py-2 rounded bg-black text-white" href="#">App Store</a>
          <a className="px-4 py-2 rounded border" href="#">Google Play</a>
          {app.url && <a className="px-4 py-2 rounded border" href={app.url} target="_blank">Live Demo</a>}
        </div>
      </section>
      <section className="mx-auto max-w-6xl p-6 grid md:grid-cols-2 gap-6">
        {(app.pages||[]).slice(0,4).map(p=>(
          <div key={p.id} className="border rounded p-3">
            <div className="font-medium">{p.title||p.url}</div>
            {p.screenshotKey && <img className="mt-2 rounded border" src={`/${p.screenshotKey}`} />}
          </div>
        ))}
      </section>
      <footer className="mx-auto max-w-6xl p-6 text-sm text-zinc-500">
        <a href={`/apps/${app.slug}/privacy`} className="underline">Privacy</a>
      </footer>
    </main>
  )
}
