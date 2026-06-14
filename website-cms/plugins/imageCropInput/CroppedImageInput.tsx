import {useCallback, useRef, useState, type ChangeEvent} from 'react'
import {ImageIcon, UploadIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {PatchEvent, set, type ObjectInputProps, useClient, useFormCallbacks} from 'sanity'
import type {ImageValue} from 'sanity'
import {CROP_ASPECT_PRESETS, type CropAspectPreset} from '../../../shared/image/cropImage'
import {ImageCropModal, type RichTextImageUploadMode} from './ImageCropModal'

type ImageCropOptions = {
  cropAspect?: number
  cropAspectPreset?: CropAspectPreset
  cropMaxSize?: number
  cropAllowAspectChange?: boolean
  cropAllowFullImage?: boolean
}

type ImageValueWithDisplay = ImageValue & {displayMode?: RichTextImageUploadMode}

const resolveAspectPreset = (options?: ImageCropOptions): CropAspectPreset => {
  if (options?.cropAspectPreset) return options.cropAspectPreset
  if (options?.cropAspect === CROP_ASPECT_PRESETS.portrait) return 'portrait'
  if (options?.cropAspect === CROP_ASPECT_PRESETS.landscape) return 'landscape'
  if (options?.cropAspect === CROP_ASPECT_PRESETS.wide) return 'wide'
  return 'square'
}

export const CroppedImageInput = (props: ObjectInputProps<ImageValue>) => {
  const {value, onChange, readOnly, renderDefault, schemaType, path} = props
  const options = (schemaType.options ?? {}) as ImageCropOptions
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const client = useClient({apiVersion: '2024-01-01'})
  const {onChange: onFormChange} = useFormCallbacks()
  const fixedAspect = typeof options.cropAspect === 'number' ? options.cropAspect : undefined
  const allowAspectChange = options.cropAllowAspectChange ?? !fixedAspect
  const allowFullImage = options.cropAllowFullImage ?? false
  const defaultAspectPreset = resolveAspectPreset(options)
  const maxOutputSize = options.cropMaxSize ?? 2400
  const fieldName = path[path.length - 1]

  const applyDisplayMode = useCallback(
    (uploadMode: RichTextImageUploadMode) => {
      if (!allowFullImage || fieldName !== 'image') return

      const slidePath = path.slice(0, -1)
      onFormChange(PatchEvent.from(set(uploadMode, [...slidePath, 'displayMode'])))
    },
    [allowFullImage, fieldName, onFormChange, path],
  )

  const uploadCroppedFile = useCallback(
    async (file: File, uploadMode: RichTextImageUploadMode) => {
      setUploading(true)
      setError(null)

      try {
        const asset = await client.assets.upload('image', file, {
          filename: file.name,
          contentType: file.type,
        })

        const nextValue: ImageValueWithDisplay = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        }

        if (allowFullImage && fieldName !== 'image') {
          nextValue.displayMode = uploadMode
        }

        onChange(PatchEvent.from(set(nextValue)))
        applyDisplayMode(uploadMode)
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Could not upload image.')
      } finally {
        setUploading(false)
        setCropFile(null)
      }
    },
    [allowFullImage, applyDisplayMode, client, fieldName, onChange],
  )

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    setCropFile(file)
    setError(null)
  }

  if (readOnly) {
    return renderDefault(props)
  }

  return (
    <Stack space={3}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{display: 'none'}}
      />

      {value?.asset ? renderDefault(props) : (
        <Card padding={4} radius={2} shadow={1} tone="transparent" border>
          <Flex align="center" gap={3}>
            <Text size={2}>
              <ImageIcon />
            </Text>
            <Stack space={3} flex={1}>
              <Text size={1} muted>
                {allowFullImage
                  ? 'Upload an image, then choose cropped banner or full display in the crop dialog.'
                  : 'Upload an image, then crop it to the right size before it is saved to Sanity.'}
              </Text>
              <Button
                icon={UploadIcon}
                text={uploading ? 'Uploading…' : 'Upload & crop'}
                tone="primary"
                mode="default"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              />
            </Stack>
          </Flex>
        </Card>
      )}

      {value?.asset ? (
        <Button
          icon={UploadIcon}
          text="Replace image"
          mode="ghost"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        />
      ) : null}

      {error ? (
        <Text size={1} style={{color: 'var(--card-critical-fg-color)'}}>
          {error}
        </Text>
      ) : null}

      <ImageCropModal
        open={Boolean(cropFile)}
        file={cropFile}
        aspect={fixedAspect}
        allowAspectChange={allowAspectChange}
        allowFullImage={allowFullImage}
        defaultAspectPreset={defaultAspectPreset}
        maxOutputSize={maxOutputSize}
        onClose={() => setCropFile(null)}
        onConfirm={(file, uploadMode) => void uploadCroppedFile(file, uploadMode)}
      />
    </Stack>
  )
}
