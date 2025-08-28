"use client"
import { useEffect, useState } from "react"
export default function AppDetail({ params }:{ params:{ id:string }}) {
  const [app,setApp]=useState<any>(null)
  const [pages,setPages]=useState<any[]>([])
  useEffect(()=>{
    fetch(`/api/apps/${params.id}`).then(r=>r.json()).then(d=>{setApp(d.app); setPages(d.pages||[])})
  },[params.id])
  if(!app) return <div className="p-6">Loading…</div>
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{app.name}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{app.url||"No URL"}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=crawl`); alert("Crawl started")}} className="rounded-xl bg-black text-white px-3 py-1.5 transition-colors hover:bg-zinc-800">Crawl</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=wire`); alert("Wireframes job queued")}} className="rounded-xl border px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700">Wireframes</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=listing`); alert("ASO job queued")}} className="rounded-xl border px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700">Listing</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=privacy`); alert("Privacy job queued")}} className="rounded-xl border px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700">Privacy</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=screens`); alert("Store screenshots job queued")}} className="rounded-xl border px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700">Store Shots</button>
        </div>
      </header>
      <section>
        <h2 className="font-semibold mb-2">Pages</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pages.map(p=>(
            <div key={p.id} className="border rounded-xl p-3 shadow-md bg-white dark:bg-zinc-800 dark:border-zinc-700">
              {p.screenshotKey && (
                <div className="relative mx-auto aspect-[9/16] w-full max-w-xs rounded-[2rem] border-4 border-black shadow-lg overflow-hidden">
                  <img className="object-cover w-full h-full" src={`/${p.screenshotKey}`} />
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs px-2 py-1 truncate">{p.title||p.url}</div>
                </div>
              )}
              {p.wireframeKey && (
                <div className="relative mx-auto aspect-[9/16] w-full max-w-xs rounded-[2rem] border-4 border-black shadow-lg overflow-hidden mt-4">
                  <img className="object-cover w-full h-full" src={`/${p.wireframeKey}`} />
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs px-2 py-1 truncate">{(p.annotations?.[0]?.label)||"Wireframe"}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
