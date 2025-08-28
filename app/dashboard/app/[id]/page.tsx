"use client"
import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
const OnePagerCustomizer = dynamic(()=>import("@/components/OnePagerCustomizer"),{ ssr:false })
const Customizer = ({ appId }:{ appId:string }) => {
  const [state,setState]=useState<any>(null as any)
  useEffect(()=>{
    fetch(`/api/apps/${appId}`).then(r=>r.json()).then(d=>{
      const a=d.app
      const current={ theme:a?.onepager?.theme, colorPrimary:a?.assets?.colorPrimary, colorAccent:a?.assets?.colorAccent, fontHeading:a?.assets?.fontHeading, fontBody:a?.assets?.fontBody }
      setState(current)
    })
  },[appId])
  if(!state) return <div className="border rounded-xl bg-white p-4 text-sm text-zinc-500">Loading settings…</div>
  return <OnePagerCustomizer appId={appId} current={state} />
}
export default function AppDetail({ params }:{ params:{ id:string }}) {
  const [app,setApp]=useState<any>(null)
  const [pages,setPages]=useState<any[]>([])
  useEffect(()=>{ fetch(`/api/apps/${params.id}`).then(r=>r.json()).then(d=>{setApp(d.app); setPages(d.pages||[])}) },[params.id])
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
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            {pages.map(p=>(
              <div key={p.id} className="border rounded-xl bg-white p-3">
                <div className="text-sm font-medium">{p.title||p.url}</div>
                {p.screenshotKey && <img className="mt-2 rounded border" src={`/${p.screenshotKey}`} />}
                {p.wireframeKey && <img className="mt-2 rounded border" src={`/${p.wireframeKey}`} />}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          {/* @ts-ignore Server to Client prop handoff via fetch */}
          <Customizer appId={app.id} />
        </div>
      </div>
    </div>
  )
}
