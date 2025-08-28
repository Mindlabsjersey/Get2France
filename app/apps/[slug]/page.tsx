import { prisma } from "@/src/lib/prisma"
import TemplateClean from "@/components/OnePagerTemplates/TemplateClean"
import TemplateBold from "@/components/OnePagerTemplates/TemplateBold"
import { getThemeTokens } from "@/src/lib/theme"

export default async function AppPage({ params }:{ params:{ slug:string }}) {
  const app = await prisma.app.findUnique({
    where:{ slug: params.slug },
    include:{ listing:true, pages:true, onepager:true, assets:true }
  })
  if (!app) return <div className="p-6">Not found</div>
  const t = getThemeTokens(app)
  const name = (app.onepager?.theme || "clean").toLowerCase()
  const pages = app.pages.sort((a,b)=>a.orderIndex-b.orderIndex)

  if (name === "bold") {
    return <TemplateBold app={app} listing={app.listing} pages={pages} t={t} />
  }
  return <TemplateClean app={app} listing={app.listing} pages={pages} t={t} />
}
