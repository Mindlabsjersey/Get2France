import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import fs from "fs/promises";

export default async function generateWireframes(appId: string) {
  const pages = await prisma.page.findMany({ where: { appId }, orderBy: { orderIndex: "asc" } });
  for (const p of pages) {
    if (!p.screenshotKey) continue;
    const input = p.screenshotKey;
    const output = input.replace("-fold.png", "-wire.png");

    const buf = await sharp(input)
      .grayscale()
      .sharpen()
      .threshold(180)
      .toBuffer();

    await fs.writeFile(output, buf);

    const labels: any[] = [];
    const collectText = (n: any, arr: string[] = []): string[] => {
      if (!n) return arr;
      if (n.text && n.text.length > 6) arr.push(n.text);
      (n.kids || []).forEach((k: any) => collectText(k, arr));
      return arr;
    };
    const texts = collectText(p.domJson).slice(0, 5);
    texts.forEach((t, i) => labels.push({ x: 24, y: 40 + i * 28, w: 600, h: 20, label: t.slice(0, 60) }));

    await prisma.page.update({ where: { id: p.id }, data: { wireframeKey: output, annotations: labels } });
  }
}
