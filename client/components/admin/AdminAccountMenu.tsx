import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, Settings, Upload, UserRound } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { uploadAdminAvatar } from "@/lib/adminAvatarUpload"
import {
  buildAdminUserMetadata,
  getAdminAvatarUrl,
  getAdminDisplayName,
  getAdminInitials,
} from "@/lib/adminUserProfile"
import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const AVATAR_URL_KEY = "avatar_url"

const AdminAccountMenu = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayName = getAdminDisplayName(user) || user?.email || "Admin"
  const initials = getAdminInitials(user)
  
  const avatarSrc = avatarPreviewUrl
    ? avatarPreviewUrl
    : avatarUrl === "removed"
      ? ""
      : avatarUrl || getAdminAvatarUrl(user)

  const hasAvatar = Boolean(avatarPreviewUrl || (avatarUrl !== "removed" && (avatarUrl || getAdminAvatarUrl(user))))

  useEffect(() => {
    if (!profileOpen) return
    setFullName(getAdminDisplayName(user))
    setAvatarUrl(user?.user_metadata?.[AVATAR_URL_KEY] ?? "")
    setPendingAvatarFile(null)
    setAvatarPreviewUrl(null)
    setError(null)
  }, [profileOpen, user])

  useEffect(() => {
    if (!pendingAvatarFile) {
      setAvatarPreviewUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(pendingAvatarFile)
    setAvatarPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [pendingAvatarFile])

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setPendingAvatarFile(file)
    setError(null)
  }

  const handleRemoveAvatar = () => {
    setPendingAvatarFile(null)
    setAvatarPreviewUrl(null)
    setAvatarUrl("removed")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setError("Please enter your name.")
      return
    }
    if (!user?.id) {
      setError("You must be signed in to update your profile.")
      return
    }

    setSaving(true)
    setError(null)

    let nextAvatarUrl = avatarUrl.trim()

    try {
      if (pendingAvatarFile) {
        setUploading(true)
        nextAvatarUrl = await uploadAdminAvatar(user.id, pendingAvatarFile)
        setUploading(false)
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...buildAdminUserMetadata(fullName),
          ...(nextAvatarUrl ? { [AVATAR_URL_KEY]: nextAvatarUrl } : { [AVATAR_URL_KEY]: null }),
        },
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setProfileOpen(false)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload photo.")
    } finally {
      setUploading(false)
      setSaving(false)
    }
  }

  const profileDialog = (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogContent className="z-[10003] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] font-host-grotesk sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-left">
            <UserRound className="h-5 w-5 text-rellia-teal" aria-hidden />
            Your profile
          </DialogTitle>
          <DialogDescription className="font-urbanist text-left">
            Update your display name and upload a profile photo for the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 font-urbanist">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
              <AvatarFallback className="bg-rellia-mint/40 text-lg text-rellia-teal">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleAvatarFileChange}
              />
              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving || uploading}
                >
                  <Upload className="mr-2 h-4 w-4" aria-hidden />
                  {pendingAvatarFile ? "Change photo" : "Upload photo"}
                </Button>
                {hasAvatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-destructive hover:bg-destructive/10"
                    onClick={handleRemoveAvatar}
                    disabled={saving || uploading}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {pendingAvatarFile ? (
                <p className="text-xs text-muted-foreground">{pendingAvatarFile.name}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="admin-profile-name">Display name</Label>
            <Input
              id="admin-profile-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="admin-profile-avatar">Or paste image URL</Label>
            <Input
              id="admin-profile-avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              disabled={Boolean(pendingAvatarFile)}
            />
            <p className="text-xs text-muted-foreground">
              Upload is preferred. URL works as a fallback if storage is unavailable.
            </p>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => setProfileOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-full"
            onClick={() => void handleSaveProfile()}
            disabled={saving || uploading}
          >
            {saving || uploading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (isMobile) {
    return (
      <>
        <div className="space-y-3 px-1">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-10 w-10 border border-slate-700">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
              <AvatarFallback className="bg-slate-800 font-urbanist text-xs text-slate-200">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-urbanist text-sm font-medium text-white">{displayName}</p>
              {user?.email ? (
                <p className="truncate font-urbanist text-xs text-slate-400">{user.email}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-left font-urbanist text-sm text-slate-300 transition-all hover:bg-white/10 hover:text-white"
              onClick={() => setProfileOpen(true)}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-left font-urbanist text-sm text-red-300 transition-all hover:bg-white/10 hover:text-white"
              onClick={() => void handleSignOut()}
            >
              Logout
            </button>
          </div>
        </div>
        {profileDialog}
      </>
    )
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Account menu"
            aria-haspopup="menu"
          >
            <Avatar className="h-9 w-9 border border-slate-700">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
              <AvatarFallback className="bg-slate-800 font-urbanist text-xs text-slate-200">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-urbanist text-sm font-medium text-white">{displayName}</p>
              {user?.email ? (
                <p className="truncate font-urbanist text-xs text-slate-400">{user.email}</p>
              ) : null}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="z-[10002] w-56 font-urbanist">
          <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
            <UserRound className="mr-2 h-4 w-4" aria-hidden />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => void handleSignOut()}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {profileDialog}
    </>
  )
}

export default AdminAccountMenu
