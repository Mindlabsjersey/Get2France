import type { AssetPack, OnePager, StoreListing, Page, App } from "@prisma/client"

export type ThemeTokens = {
  name: string
  dark: boolean
  color: string
  fontHeading: string
  fontBody: string
}

export function getThemeTokens(app: App & { assets: AssetPack | null, onepager: OnePager | null }): ThemeTokens {
  const color = app.assets?.colorAccent || app.assets?.colorPrimary || "#4f46e5" // indigo-600
  const fontHeading = app.assets?.fontHeading || "Inter, system-ui, sans-serif"
  const fontBody = app.assets?.fontBody || "Inter, system-ui, sans-serif"
  const dark = false // can be expanded later; dashboard switch writes to onepager.seo like {dark:true}
  return { name: app.onepager?.theme || "clean", dark, color, fontHeading, fontBody }
}
