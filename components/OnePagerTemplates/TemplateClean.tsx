import React from "react"
import DeviceFrame from "@/components/DeviceFrame"
import type { App, StoreListing, Page } from "@prisma/client"
import { ThemeTokens } from "@/src/lib/theme"

export default function TemplateClean({
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
  const firstShots = pages.slice(0, 4)
  return (
    <main style={{ fontFamily: t.fontBody }} className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 style={{ fontFamily: t.fontHeading }} className="text-5xl font-bold tracking-tight">
          {app.name}
        </h1>
        <p className="mt-3 text-lg text-zinc-600">{listing?.shortDesc}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-lg px-4 py-2 text-white" style={{ backgroundColor: t.color }} href="#">
            App Store
          </a>
          <a className="rounded-lg border px-4 py-2" href="#">Google Play</a>
          {app.url && (
            <a className="rounded-lg border px-4 py-2" href={app.url} target="_blank">
              Live Demo
            </a>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 pb-16">
        {firstShots.map((p) => (
          <div key={p.id} className="space-y-2">
            <h3 style={{ fontFamily: t.fontHeading }} className="font-semibold">
              {p.title || p.url}
            </h3>
            {p.screenshotKey && (
              <DeviceFrame src={`/${p.screenshotKey}`} caption={p.title || p.url || ""} />
            )}
          </div>
        ))}
      </section>

      <section className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 style={{ fontFamily: t.fontHeading }} className="text-2xl font-bold">
            Why you’ll love {app.name}
          </h2>
          <div className="mt-4 whitespace-pre-wrap text-zinc-700">{listing?.fullDesc}</div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-500 border-t">
        <a href={`/apps/${app.slug}/privacy`} className="underline">
          Privacy
        </a>
      </footer>
    </main>
  )
}
