import {useCallback, useEffect, useState} from 'react'
import Cropper, {type Area} from 'react-easy-crop'
import {Box, Button, Dialog, Flex, Label, Select, Stack, Text} from '@sanity/ui'
import {
  CROP_ASPECT_PRESETS,
  cropFileToFile,
  getTopCenterCropPercent,
  percentCropToPixels,
  type CropAspectPreset,
} from '../../../shared/image/cropImage'

const PRESET_LABELS: Record<CropAspectPreset, string> = {
  square: 'Square (1:1)',
  portrait: 'Portrait (3:4)',
  landscape: 'Landscape (4:3)',
  wide: 'Wide (16:9)',
}

type ImageCropModalProps = {
  open: boolean
  file: File | null
  aspect?: number
  allowAspectChange?: boolean
  defaultAspectPreset?: CropAspectPreset
  maxOutputSize?: number
  onClose: () => void
  onConfirm: (file: File) => void
}

export const ImageCropModal = ({
  open,
  file,
  aspect: fixedAspect,
  allowAspectChange = false,
  defaultAspectPreset = 'square',
  maxOutputSize = 2000,
  onClose,
  onConfirm,
}: ImageCropModalProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  const [aspectPreset, setAspectPreset] = useState<CropAspectPreset>(defaultAspectPreset)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [mediaSize, setMediaSize] = useState<{width: number; height: number} | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const aspect = fixedAspect ?? CROP_ASPECT_PRESETS[aspectPreset]

  useEffect(() => {
    if (!open || !file) {
      setImageSrc(null)
      setCrop({x: 0, y: 0})
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
    (size: {width: number; height: number}) => {
      setMediaSize(size)
      const topCrop = getTopCenterCropPercent(size.width, size.height, aspect)
      setCrop({x: 0, y: 0})
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
      onClose()
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : 'Could not crop image.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <Dialog
      id="image-crop-modal"
      header="Crop image before upload"
      onClose={onClose}
      width={1}
      zOffset={1200}
    >
      <Stack space={4} padding={4}>
        <Text muted size={1}>
          Drag to reposition. Images are cropped from the top by default so faces and headers are not
          cut off awkwardly on the site.
        </Text>

        {allowAspectChange && !fixedAspect ? (
          <Stack space={2}>
            <Label>Aspect ratio</Label>
            <Select
              value={aspectPreset}
              onChange={(event) => setAspectPreset(event.currentTarget.value as CropAspectPreset)}
            >
              {(Object.keys(PRESET_LABELS) as CropAspectPreset[]).map((preset) => (
                <option key={preset} value={preset}>
                  {PRESET_LABELS[preset]}
                </option>
              ))}
            </Select>
          </Stack>
        ) : null}

        <Box
          style={{
            position: 'relative',
            height: 'min(52vh, 360px)',
            width: '100%',
            overflow: 'hidden',
            borderRadius: '12px',
            background: 'var(--card-muted-bg-color)',
          }}
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
              onCropComplete={(_area, areaPixels) => setCroppedAreaPixels(areaPixels)}
              onMediaLoaded={handleMediaLoaded}
              objectFit="contain"
              restrictPosition
              showGrid
            />
          ) : null}
        </Box>

        <Stack space={2}>
          <Label>Zoom</Label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.currentTarget.value))}
            aria-label="Crop zoom"
            style={{width: '100%'}}
          />
        </Stack>

        {error ? (
          <Text size={1} style={{color: 'var(--card-critical-fg-color)'}}>
            {error}
          </Text>
        ) : null}

        <Flex gap={3} justify="flex-end">
          <Button mode="ghost" text="Cancel" onClick={onClose} disabled={saving} />
          <Button
            tone="primary"
            text={saving ? 'Uploading…' : 'Use cropped image'}
            onClick={() => void handleConfirm()}
            disabled={!file || !croppedAreaPixels || saving}
          />
        </Flex>
      </Stack>
    </Dialog>
  )
}
