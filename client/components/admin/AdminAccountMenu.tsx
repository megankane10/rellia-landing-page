import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronUp, LogOut, Upload, UserRound } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { uploadAdminAvatar } from "@/lib/adminAvatarUpload"
import ImageCropDialog from "@/components/ImageCropDialog"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import {
  adminDarkDialogContentClass,
  adminDarkDialogShellClass,
  adminDarkMenuContentClass,
  adminDarkMenuItemClass,
  adminDarkMenuSeparatorClass,
  adminSidebarAccountButtonClass,
  adminSidebarAccountTextClass,
  adminSidebarIconSlot,
} from "@/components/admin/adminSidebarRail"
import { cn } from "@/lib/utils"

const AVATAR_URL_KEY = "avatar_url"

const AdminAccountMenu = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { state: sidebarState } = useSidebar()
  const isCollapsed = sidebarState === "collapsed" && !isMobile
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
  const [cropSourceFile, setCropSourceFile] = useState<File | null>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
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
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setFullName(getAdminDisplayName(user))
      setAvatarUrl(user?.user_metadata?.[AVATAR_URL_KEY] ?? "")
      setPendingAvatarFile(null)
      setCropSourceFile(null)
      setCropDialogOpen(false)
      setAvatarPreviewUrl(null)
      setError(null)
    })
    return () => {
      cancelled = true
    }
  }, [profileOpen, user])

  useEffect(() => {
    if (!pendingAvatarFile) {
      let cancelled = false
      queueMicrotask(() => {
        if (cancelled) return
        setAvatarPreviewUrl(null)
      })
      return () => {
        cancelled = true
      }
      return
    }
    const objectUrl = URL.createObjectURL(pendingAvatarFile)
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setAvatarPreviewUrl(objectUrl)
    })
    return () => {
      cancelled = true
      URL.revokeObjectURL(objectUrl)
    }
  }, [pendingAvatarFile])

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setCropSourceFile(file)
    setCropDialogOpen(true)
    setError(null)
  }

  const handleAvatarCropConfirm = (file: File) => {
    setPendingAvatarFile(file)
    setCropSourceFile(null)
    setAvatarUrl("")
    setError(null)
  }

  const handleAvatarCropCancel = () => {
    setCropSourceFile(null)
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
      <DialogContent
        className={cn(
          "z-[10003] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] font-host-grotesk sm:max-w-md",
          adminDarkDialogShellClass,
          adminDarkDialogContentClass,
        )}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-left text-white">
            <UserRound className="h-5 w-5 text-rellia-mint" aria-hidden />
            Your profile
          </DialogTitle>
          <DialogDescription className="font-urbanist text-left text-slate-400">
            Update your display name and upload a profile photo
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 font-urbanist">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-slate-700">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} alt="" />
              ) : null}
              <AvatarFallback className="bg-slate-800 text-lg text-slate-200">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleAvatarFileChange}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
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
                    className="rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
            onClick={() => setProfileOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-full bg-rellia-mint text-black hover:bg-rellia-mint/90"
            onClick={() => void handleSaveProfile()}
            disabled={saving || uploading}
          >
            {saving || uploading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const accountTrigger = (
    <button
      type="button"
      className={cn(
        adminSidebarAccountButtonClass,
        isMobile && "rounded-xl hover:!bg-card/[0.07]",
      )}
      aria-label="Account menu"
      aria-haspopup="menu"
    >
      <span className={adminSidebarIconSlot}>
        <Avatar className="h-9 w-9 border border-slate-700">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          <AvatarFallback className="bg-slate-800 font-urbanist text-xs text-slate-200">{initials}</AvatarFallback>
        </Avatar>
      </span>
      <div className={adminSidebarAccountTextClass}>
        <p className="truncate font-urbanist text-[15px] font-medium leading-tight text-white">{displayName}</p>
        {user?.email ? (
          <p className="truncate font-urbanist text-sm leading-tight text-slate-400">{user.email}</p>
        ) : null}
      </div>
      {isMobile ? (
        <ChevronUp className="ml-auto mr-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      ) : null}
    </button>
  )

  const accountMenu = (
    <DropdownMenu modal={false}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{accountTrigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            {displayName}
          </TooltipContent>
        </Tooltip>
      ) : (
        <DropdownMenuTrigger asChild>{accountTrigger}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        side="top"
        align={isMobile ? "end" : "start"}
        sideOffset={8}
        alignOffset={isMobile ? 8 : 0}
        className={cn(adminDarkMenuContentClass, isMobile ? "w-64 font-urbanist" : "w-56 font-urbanist")}
      >
        <DropdownMenuItem
          className={adminDarkMenuItemClass}
          onSelect={() => setProfileOpen(true)}
        >
          <UserRound className="mr-2 h-4 w-4 text-slate-400" aria-hidden />
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className={adminDarkMenuSeparatorClass} />
        <DropdownMenuItem
          className={cn(adminDarkMenuItemClass, "text-red-400 focus:text-red-300")}
          onSelect={() => void handleSignOut()}
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      {accountMenu}
      {profileDialog}

      <ImageCropDialog
        open={cropDialogOpen}
        file={cropSourceFile}
        title="Crop profile photo"
        description="Crop to a square from the top of the image so it displays correctly in the dashboard."
        aspect={1}
        maxOutputSize={512}
        variant="dark"
        onOpenChange={setCropDialogOpen}
        onConfirm={handleAvatarCropConfirm}
        onCancel={handleAvatarCropCancel}
      />
    </>
  )
}

export default AdminAccountMenu
