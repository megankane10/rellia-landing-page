import { mkdir, readdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const ROOT = path.resolve(import.meta.dirname, "..")
const IMAGES_DIR = path.join(ROOT, "public", "images")
const OUTPUT_DIR = path.join(IMAGES_DIR, "opt")

const SOURCE_PATTERNS = [
  /^portfolio-/i,
  /^testimonials-/i,
  /^paths-/i,
  /^hologram-logo/i,
  /^metrics-bg-/i,
  /^logo-rellia/i,
  /^whyrellia-/i,
]

const WIDTHS_BY_PATTERN: Array<{ test: RegExp; widths: number[] }> = [
  { test: /^testimonials-/i, widths: [48, 96] },
  { test: /^portfolio-/i, widths: [120, 240] },
  { test: /^hologram-logo/i, widths: [240, 480] },
  { test: /^logo-rellia/i, widths: [96, 192] },
  { test: /^paths-/i, widths: [400, 800] },
  { test: /^metrics-bg-/i, widths: [960, 1440, 1920] },
  { test: /^whyrellia-/i, widths: [400, 800] },
]

const DEFAULT_WIDTHS = [400, 800]

const isSourceFile = (filename: string): boolean =>
  /\.(png|jpe?g)$/i.test(filename) && SOURCE_PATTERNS.some((pattern) => pattern.test(filename))

const widthsForFile = (filename: string): number[] => {
  const match = WIDTHS_BY_PATTERN.find((entry) => entry.test.test(filename))
  return match?.widths ?? DEFAULT_WIDTHS
}

const optimizeImage = async (filename: string): Promise<number> => {
  const inputPath = path.join(IMAGES_DIR, filename)
  const basename = filename.replace(/\.(png|jpe?g)$/i, "")
  const widths = widthsForFile(filename)
  let written = 0

  for (const width of widths) {
    const outputPath = path.join(OUTPUT_DIR, `${basename}-${width}.webp`)
    await sharp(inputPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath)
    written += 1
  }

  return written
}

const main = async () => {
  await mkdir(OUTPUT_DIR, { recursive: true })
  const files = (await readdir(IMAGES_DIR)).filter(isSourceFile)
  let variantCount = 0

  for (const file of files) {
    variantCount += await optimizeImage(file)
  }

  console.log(`Optimized ${files.length} source images into ${variantCount} WebP variants in public/images/opt`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
