export type CropAreaPixels = {
  x: number
  y: number
  width: number
  height: number
}

export type CropAreaPercent = {
  x: number
  y: number
  width: number
  height: number
}

export const CROP_ASPECT_PRESETS = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
  wide: 16 / 9,
} as const

export type CropAspectPreset = keyof typeof CROP_ASPECT_PRESETS

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", () => reject(new Error("Could not load image for cropping.")))
    image.crossOrigin = "anonymous"
    image.src = src
  })

/** Cover-style crop box aligned to the top center of the image (percentages for react-easy-crop). */
export const getTopCenterCropPercent = (
  imageWidth: number,
  imageHeight: number,
  aspect: number,
): CropAreaPercent => {
  if (!imageWidth || !imageHeight || !aspect) {
    return { x: 0, y: 0, width: 100, height: 100 }
  }

  const imageAspect = imageWidth / imageHeight

  if (imageAspect > aspect) {
    const cropHeightPercent = 100
    const cropWidthPercent = (aspect / imageAspect) * 100
    return {
      x: (100 - cropWidthPercent) / 2,
      y: 0,
      width: cropWidthPercent,
      height: cropHeightPercent,
    }
  }

  const cropWidthPercent = 100
  const cropHeightPercent = (imageAspect / aspect) * 100
  return {
    x: 0,
    y: 0,
    width: cropWidthPercent,
    height: Math.min(cropHeightPercent, 100),
  }
}

export const percentCropToPixels = (
  imageWidth: number,
  imageHeight: number,
  area: CropAreaPercent,
): CropAreaPixels => ({
  x: Math.round((area.x / 100) * imageWidth),
  y: Math.round((area.y / 100) * imageHeight),
  width: Math.round((area.width / 100) * imageWidth),
  height: Math.round((area.height / 100) * imageHeight),
})

export const getCroppedImageBlob = async (
  imageSrc: string,
  pixelCrop: CropAreaPixels,
  options?: {
    maxWidth?: number
    maxHeight?: number
    mimeType?: string
    quality?: number
  },
): Promise<Blob> => {
  const image = await loadImageElement(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Could not prepare image canvas.")
  }

  const maxWidth = options?.maxWidth ?? pixelCrop.width
  const maxHeight = options?.maxHeight ?? pixelCrop.height
  const scale = Math.min(1, maxWidth / pixelCrop.width, maxHeight / pixelCrop.height)

  canvas.width = Math.max(1, Math.round(pixelCrop.width * scale))
  canvas.height = Math.max(1, Math.round(pixelCrop.height * scale))

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const mimeType = options?.mimeType ?? "image/jpeg"
  const quality = options?.quality ?? 0.92

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not export cropped image."))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality,
    )
  })
}

export const blobToFile = (blob: Blob, fileName: string): File =>
  new File([blob], fileName, { type: blob.type })

export const readFileAsObjectUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const result = reader.result
      if (typeof result !== "string") {
        reject(new Error("Could not read image file."))
        return
      }
      resolve(result)
    })
    reader.addEventListener("error", () => reject(new Error("Could not read image file.")))
    reader.readAsDataURL(file)
  })

export const cropFileToFile = async (
  file: File,
  aspect: number,
  pixelCrop: CropAreaPixels,
  options?: {
    maxWidth?: number
    maxHeight?: number
    outputBaseName?: string
  },
): Promise<File> => {
  const objectUrl = await readFileAsObjectUrl(file)
  try {
    const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg"
    const blob = await getCroppedImageBlob(objectUrl, pixelCrop, {
      maxWidth: options?.maxWidth,
      maxHeight: options?.maxHeight,
      mimeType,
    })
    const ext = mimeType === "image/png" ? "png" : "jpg"
    const base = options?.outputBaseName ?? (file.name.replace(/\.[^.]+$/, "") || "image")
    return blobToFile(blob, `${base}-cropped.${ext}`)
  } finally {
    if (objectUrl.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrl)
    }
  }
}
