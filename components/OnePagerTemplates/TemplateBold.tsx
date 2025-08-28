import React from "react"
import DeviceFrame from "@/components/DeviceFrame"
import type { App, StoreListing, Page } from "@prisma/client"
import { ThemeTokens } from "@/src/lib/theme"

export default function TemplateBold({
  app,
  listing,
  pages,
  t
}: {
  app: App
  listing: StoreListing | null
  pages: Page[]
  t: ThemeTokens
}) {
  const shots = pages.slice(0, 3)
  const grad = `linear-gradient(135deg, ${t.color}, #111827)`
  return (
    <main style={{ fontFamily: t.fontBody }} className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="relative">
        <div className="absolute inset-0" style={{ backgroundImage: grad, opacity: 0.15 }} />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <h1 style={{ fontFamily: t.fontHeading }} className="text-6xl font-extrabold tracking-tight">
            {app.name}
          </h1>
          <p className="mt-4 text-xl text-zinc-200">{listing?.shortDesc}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="rounded-lg px-5 py-2.5 text-white" style={{ backgroundColor: t.color }} href="#">
              Get the app
            </a>
            {app.url && (
              <a className="rounded-lg border border-zinc-700 px-5 py-2.5" href={app.url} target="_blank">
                Live Demo
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-8 py-16">
        {shots.map((p) => (
          <div key={p.id} className="space-y-2">
            <h3 style={{ fontFamily: t.fontHeading }} className="font-semibold text-zinc-200">
              {p.title || p.url}
            </h3>
            {p.screenshotKey && (
              <DeviceFrame src={`/${p.screenshotKey}`} caption={p.title || p.url || ""} />
            )}
          </div>
        ))}
      </section>

      <section className="bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 style={{ fontFamily: t.fontHeading }} className="text-2xl font-bold">
            Features
          </h2>
          <div className="mt-4 whitespace-pre-wrap text-zinc-300">{listing?.fullDesc}</div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-400 border-t border-zinc-800">
        <a href={`/apps/${app.slug}/privacy`} className="underline">
          Privacy
        </a>
      </footer>
    </main>
  )
}
