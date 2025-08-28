"use client"
import { useState } from "react"

export default function OnePagerCustomizer({ appId, current }:{
  appId: string,
  current: { theme?: string, colorPrimary?: string, colorAccent?: string, fontHeading?: string, fontBody?: string }
}) {
  const [theme,setTheme]=useState(current.theme || "clean")
  const [color,setColor]=useState(current.colorAccent || current.colorPrimary || "#4f46e5")
  const [fontH,setFontH]=useState(current.fontHeading || "Inter, system-ui, sans-serif")
  const [fontB,setFontB]=useState(current.fontBody || "Inter, system-ui, sans-serif")
  const save = async ()=>{
    await fetch("/api/onepager",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ appId, theme, color, fontHeading: fontH, fontBody: fontB })
    })
    alert("Saved. Open the public page to preview.")
  }
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="font-semibold mb-3">One-Pager Settings</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm">
          <div className="mb-1">Template</div>
          <select value={theme} onChange={e=>setTheme(e.target.value)} className="w-full rounded border px-2 py-1.5">
            <option value="clean">Clean (light)</option>
            <option value="bold">Bold (dark)</option>
          </select>
        </label>
        <label className="text-sm">
          <div className="mb-1">Accent Color</div>
          <input value={color} onChange={e=>setColor(e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="#4f46e5" />
        </label>
        <label className="text-sm">
          <div className="mb-1">Font (Heading)</div>
          <input value={fontH} onChange={e=>setFontH(e.target.value)} className="w-full rounded border px-2 py-1.5" />
        </label>
        <label className="text-sm">
          <div className="mb-1">Font (Body)</div>
          <input value={fontB} onChange={e=>setFontB(e.target.value)} className="w-full rounded border px-2 py-1.5" />
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={save} className="rounded-lg bg-black text-white px-3 py-1.5">Save</button>
        <a className="rounded-lg border px-3 py-1.5" href="#" onClick={(e)=>{e.preventDefault(); location.reload()}}>Reload</a>
      </div>
    </div>
  )
}
