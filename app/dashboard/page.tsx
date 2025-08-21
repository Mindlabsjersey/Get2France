"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
export default function Dashboard() {
  const [apps,setApps]=useState<any[]>([])
  useEffect(()=>{ fetch("/api/apps").then(r=>r.json()).then(d=>setApps(d.items||[])) },[])
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Apps</h1>
        <button onClick={async()=>{
          const name=prompt("App name?")||"My App"
          const url=prompt("Public URL to crawl (optional)?")||""
          const platform="WEB"
          const r=await fetch("/api/apps",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,url,platform})})
          if(r.ok){location.reload()}
        }} className="rounded bg-black text-white px-3 py-1.5">Create App</button>
      </div>
      <ul className="mt-6 grid gap-4">
        {apps.map(a=>(
          <li key={a.id} className="border rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-zinc-500">{a.url||"No URL"}</div>
              </div>
              <div className="flex gap-2">
                <Link className="rounded border px-3 py-1.5" href={`/dashboard/app/${a.id}`}>Open</Link>
                {a.slug && <a className="rounded border px-3 py-1.5" target="_blank" href={`/apps/${a.slug}`}>One-pager</a>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
