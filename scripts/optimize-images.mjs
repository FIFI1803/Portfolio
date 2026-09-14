import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const WIDTHS = [640, 1280, 1920]
// Hero is typographic — no portrait. Only the About portrait is processed.
const SOURCES = [
  { src: 'public/JPEG image.png', name: 'portrait-about' },
]

await mkdir('public/img', { recursive: true })

for (const { src, name } of SOURCES) {
  const meta = await sharp(src).metadata()
  for (const w of WIDTHS) {
    if (w > meta.width) continue
    const base = sharp(src).resize({ width: w, withoutEnlargement: true })
    await base.clone().avif({ quality: 55 }).toFile(`public/img/${name}-${w}.avif`)
    await base.clone().webp({ quality: 72 }).toFile(`public/img/${name}-${w}.webp`)
    await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`public/img/${name}-${w}.jpg`)
  }
  console.log(`${name}: source ${meta.width}x${meta.height}`)
}
