import { supabase } from "@/lib/supabase"

const ADMIN_AVATARS_BUCKET = "admin-avatars"
const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

export const uploadAdminAvatar = async (userId: string, file: File): Promise<string> => {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, WebP, or GIF image.")
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("Image must be 5 MB or smaller.")
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const objectPath = `${userId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(ADMIN_AVATARS_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    throw new Error(
      uploadError.message.includes("Bucket not found")
        ? "Avatar storage is not configured yet. Run scripts/supabase_admin_avatars_storage.sql in Supabase."
        : uploadError.message,
    )
  }

  const { data } = supabase.storage.from(ADMIN_AVATARS_BUCKET).getPublicUrl(objectPath)
  const publicUrl = data.publicUrl?.trim()
  if (!publicUrl) throw new Error("Could not resolve uploaded image URL.")
  return publicUrl
}

export const uploadAdminTeamNoteImage = async (userId: string, file: File): Promise<string> => {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, WebP, or GIF image.")
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("Image must be 5 MB or smaller.")
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const objectPath = `${userId}/team-note-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(ADMIN_AVATARS_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    throw new Error(
      uploadError.message.includes("Bucket not found")
        ? "Image storage is not configured yet. Run scripts/supabase_admin_avatars_storage.sql in Supabase."
        : uploadError.message,
    )
  }

  const { data } = supabase.storage.from(ADMIN_AVATARS_BUCKET).getPublicUrl(objectPath)
  const publicUrl = data.publicUrl?.trim()
  if (!publicUrl) throw new Error("Could not resolve uploaded image URL.")
  return publicUrl
}
