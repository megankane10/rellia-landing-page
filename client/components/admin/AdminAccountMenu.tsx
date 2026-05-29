import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Pencil, UserRound } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
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
const AVATAR_URL_KEY = "avatar_url"

const AdminAccountMenu = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [profileOpen, setProfileOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayName = getAdminDisplayName(user) || user?.email || "Admin"
  const initials = getAdminInitials(user)
  const avatarSrc = getAdminAvatarUrl(user)

  useEffect(() => {
    if (!profileOpen) return
    setFullName(getAdminDisplayName(user))
    setAvatarUrl(getAdminAvatarUrl(user))
    setError(null)
  }, [profileOpen, user])

  const handleSignOut = async () => {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setError("Please enter your name.")
      return
    }
    setSaving(true)
    setError(null)
    const trimmedAvatar = avatarUrl.trim()
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...buildAdminUserMetadata(fullName),
        ...(trimmedAvatar ? { [AVATAR_URL_KEY]: trimmedAvatar } : { [AVATAR_URL_KEY]: null }),
      },
    })
    setSaving(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setProfileOpen(false)
  }

  const profileDialog = (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogContent className="z-[10003] font-host-grotesk sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-rellia-teal" aria-hidden />
            Your profile
          </DialogTitle>
          <DialogDescription className="font-urbanist">
            Updates your display name and optional profile photo URL across the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 font-urbanist">
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
            <Label htmlFor="admin-profile-avatar">Profile photo URL</Label>
            <Input
              id="admin-profile-avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
            />
            <p className="text-xs text-muted-foreground">
              Paste a link to a square image (team headshot, Gravatar, etc.). Leave blank to use initials.
            </p>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setProfileOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleSaveProfile()} disabled={saving}>
            {saving ? "Saving…" : "Save"}
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
            <Avatar className="h-10 w-10 border border-sidebar-border">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
              <AvatarFallback className="bg-rellia-mint/40 font-urbanist text-xs text-rellia-teal">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-urbanist text-sm font-medium text-sidebar-foreground">{displayName}</p>
              {user?.email ? (
                <p className="truncate font-urbanist text-xs text-sidebar-foreground/55">{user.email}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-lg font-urbanist"
              onClick={() => setProfileOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" aria-hidden />
              Edit name & photo
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-lg font-urbanist text-destructive hover:text-destructive"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden />
              Sign out
            </Button>
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
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Account menu"
          >
            <Avatar className="h-9 w-9 border border-sidebar-border">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
              <AvatarFallback className="bg-rellia-mint/40 font-urbanist text-xs text-rellia-teal">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-urbanist text-sm font-medium text-sidebar-foreground">{displayName}</p>
              {getAdminDisplayName(user) ? (
                <p className="truncate font-urbanist text-xs text-sidebar-foreground/55">{user?.email}</p>
              ) : null}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="z-[10002] w-56 font-urbanist">
          <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" aria-hidden />
            Edit name & photo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => void handleSignOut()}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {profileDialog}
    </>
  )
}

export default AdminAccountMenu
