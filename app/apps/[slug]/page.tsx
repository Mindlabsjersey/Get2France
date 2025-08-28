import { prisma } from "@/src/lib/prisma"
export default async function AppPage({ params }:{ params:{ slug:string }}) {
  const app = await prisma.app.findUnique({ where:{ slug: params.slug }, include:{ listing:true, pages:true }})
  if (!app) return <div className="p-6">Not found</div>
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-6xl p-6">
        <h1 className="text-4xl font-bold">{app.name}</h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{app.listing?.shortDesc}</p>
        <div className="mt-4 flex gap-2">
          <a className="px-4 py-2 rounded-xl bg-black text-white transition-colors hover:bg-zinc-800" href="#">App Store</a>
          <a className="px-4 py-2 rounded-xl border transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700" href="#">Google Play</a>
          {app.url && <a className="px-4 py-2 rounded-xl border transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700" href={app.url} target="_blank">Live Demo</a>}
        </div>
      </section>
      <section className="mx-auto max-w-6xl p-6 grid md:grid-cols-2 gap-6">
        {(app.pages||[]).slice(0,4).map(p=>(
          <div key={p.id} className="border rounded-xl p-4 shadow-md bg-white dark:bg-zinc-800 dark:border-zinc-700">
            {p.screenshotKey && (
              <div className="relative mx-auto aspect-[9/16] w-full max-w-xs rounded-[2rem] border-4 border-black shadow-lg overflow-hidden">
                <img className="object-cover w-full h-full" src={`/${p.screenshotKey}`} />
                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs px-2 py-1 truncate">{p.title||p.url}</div>
              </div>
            )}
          </div>
        ))}
      </section>
      <footer className="mx-auto max-w-6xl p-6 text-sm text-zinc-500 dark:text-zinc-400">
        <a href={`/apps/${app.slug}/privacy`} className="underline">Privacy</a>
      </footer>
    </div>
  )
}
