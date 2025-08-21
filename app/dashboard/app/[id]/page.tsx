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
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{app.name}</h1>
          <p className="text-sm text-zinc-500">{app.url||"No URL"}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=crawl`); alert("Crawl started")}} className="rounded bg-black text-white px-3 py-1.5">Crawl</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=wire`); alert("Wireframes job queued")}} className="rounded border px-3 py-1.5">Wireframes</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=listing`); alert("ASO job queued")}} className="rounded border px-3 py-1.5">Listing</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=privacy`); alert("Privacy job queued")}} className="rounded border px-3 py-1.5">Privacy</button>
          <button onClick={async()=>{await fetch(`/api/pipeline/run?appId=${app.id}&step=screens`); alert("Store screenshots job queued")}} className="rounded border px-3 py-1.5">Store Shots</button>
        </div>
      </header>
      <section>
        <h2 className="font-semibold mb-2">Pages</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pages.map(p=>(
            <div key={p.id} className="border rounded p-3">
              <div className="text-sm font-medium">{p.title||p.url}</div>
              {p.screenshotKey && <img className="mt-2 rounded border" src={`/${p.screenshotKey}`} />}
              {p.wireframeKey && <img className="mt-2 rounded border" src={`/${p.wireframeKey}`} />}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
