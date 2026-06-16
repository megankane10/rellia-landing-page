import { useCallback, useEffect, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import {
  CROP_ASPECT_PRESETS,
  cropFileToFile,
  getTopCenterCropPercent,
  percentCropToPixels,
  type CropAspectPreset,
} from "../../shared/image/cropImage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { adminDarkDialogContentClass, adminDarkDialogShellClass, adminLightDialogShellClass } from "@/components/admin/adminSidebarRail"
import { cn } from "@/lib/utils"

type ImageCropDialogProps = {
  open: boolean
  file: File | null
  title?: string
  description?: string
  aspect?: number
  allowAspectChange?: boolean
  defaultAspectPreset?: CropAspectPreset
  maxOutputSize?: number
  variant?: "light" | "dark"
  onOpenChange: (open: boolean) => void
  onConfirm: (file: File) => void
  onCancel?: () => void
}

const PRESET_LABELS: Record<CropAspectPreset, string> = {
  square: "Square (1:1)",
  portrait: "Portrait (3:4)",
  landscape: "Landscape (4:3)",
  wide: "Wide (16:9)",
}

const ImageCropDialog = ({
  open,
  file,
  title = "Crop image",
  description = "Drag to reposition. The preview matches how the image will be saved.",
  aspect: fixedAspect,
  allowAspectChange = false,
  defaultAspectPreset = "square",
  maxOutputSize = 1200,
  variant = "light",
  onOpenChange,
  onConfirm,
  onCancel,
}: ImageCropDialogProps) => {
  const isDark = variant === "dark"
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspectPreset, setAspectPreset] = useState<CropAspectPreset>(defaultAspectPreset)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [mediaSize, setMediaSize] = useState<{ width: number; height: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const aspect = fixedAspect ?? CROP_ASPECT_PRESETS[aspectPreset]

  useEffect(() => {
    if (!open || !file) {
      setImageSrc(null)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
      setMediaSize(null)
      setError(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setImageSrc(objectUrl)
    setAspectPreset(defaultAspectPreset)

    return () => URL.revokeObjectURL(objectUrl)
  }, [open, file, defaultAspectPreset])

  const handleMediaLoaded = useCallback(
    (size: { width: number; height: number }) => {
      setMediaSize(size)
      const topCrop = getTopCenterCropPercent(size.width, size.height, aspect)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(percentCropToPixels(size.width, size.height, topCrop))
    },
    [aspect],
  )

  useEffect(() => {
    if (!mediaSize) return
    const topCrop = getTopCenterCropPercent(mediaSize.width, mediaSize.height, aspect)
    setCroppedAreaPixels(percentCropToPixels(mediaSize.width, mediaSize.height, topCrop))
  }, [aspect, mediaSize])

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleClose = () => {
    onOpenChange(false)
    onCancel?.()
  }

  const handleConfirm = async () => {
    if (!file || !croppedAreaPixels) return

    setSaving(true)
    setError(null)

    try {
      const cropped = await cropFileToFile(file, aspect, croppedAreaPixels, {
        maxWidth: maxOutputSize,
        maxHeight: maxOutputSize,
      })
      onConfirm(cropped)
      onOpenChange(false)
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : "Could not crop image.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "z-[10004] w-[calc(100vw-2rem)] max-w-lg font-host-grotesk",
          isDark ? adminDarkDialogShellClass : adminLightDialogShellClass,
          isDark && adminDarkDialogContentClass,
        )}
      >
        <DialogHeader className="text-left">
          <DialogTitle className={cn(isDark && "text-white")}>{title}</DialogTitle>
          <DialogDescription className={cn("font-urbanist", isDark && "text-slate-400")}>
            {description}
          </DialogDescription>
        </DialogHeader>

        {allowAspectChange && !fixedAspect ? (
          <div className="space-y-1">
            <Label htmlFor="crop-aspect-preset" className={cn(isDark && "text-slate-300")}>
              Aspect ratio
            </Label>
            <Select
              value={aspectPreset}
              onValueChange={(value) => setAspectPreset(value as CropAspectPreset)}
            >
              <SelectTrigger id="crop-aspect-preset" className="font-urbanist">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[10005]">
                {(Object.keys(PRESET_LABELS) as CropAspectPreset[]).map((preset) => (
                  <SelectItem key={preset} value={preset}>
                    {PRESET_LABELS[preset]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div
          className={cn(
            "relative h-[min(52vh,360px)] w-full overflow-hidden rounded-2xl bg-muted",
            !imageSrc && "animate-pulse",
          )}
        >
          {imageSrc ? (
            <Cropper
              key={String(aspect)}
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              onMediaLoaded={handleMediaLoaded}
              objectFit="contain"
              restrictPosition
              showGrid
            />
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="crop-zoom" className={cn(isDark && "text-slate-300")}>
            Zoom
          </Label>
          <Slider
            id="crop-zoom"
            min={1}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0] ?? 1)}
            aria-label="Crop zoom"
          />
        </div>

        {error ? <p className={cn("text-sm text-destructive", isDark && "text-red-400")}>{error}</p> : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className={cn(
              "rounded-full",
              isDark && "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white",
            )}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={cn("rounded-full", isDark && "bg-rellia-teal text-white hover:bg-rellia-teal/90")}
            onClick={() => void handleConfirm()}
            disabled={!file || !croppedAreaPixels || saving}
          >
            {saving ? "Saving…" : "Use cropped image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCropDialog
