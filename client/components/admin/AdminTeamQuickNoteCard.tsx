import { useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, ImagePlus, Link2, Megaphone, MoonStar, Pencil, Sticker, Upload } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useAdminTheme } from "@/context/AdminThemeContext"
import { adminPopoverContentForTheme } from "@/components/admin/adminSidebarRail"
import ImageCropDialog from "@/components/ImageCropDialog"
import {
  fetchAdminTeamNote,
  publishAdminTeamNote,
  removeAdminTeamNote,
  toggleAdminTeamNoteReaction,
  type AdminTeamNoteBlock,
  type AdminTeamNoteReaction,
  type AdminTeamUser,
} from "@/lib/adminApi"
import { uploadAdminTeamNoteImage } from "@/lib/adminAvatarUpload"
import {
  getAdminAvatarUrl,
  getAdminDisplayName,
  resolveAdminMemberAvatarUrl,
} from "@/lib/adminUserProfile"
import { formatAdminRelativeAgo } from "@/lib/adminSubmissionStatus"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import AdminDeleteIconButton from "@/components/admin/AdminDeleteIconButton"
import { adminHighlightedSurfaceClass, adminTeamCardContentClass, adminTeamCardHeaderClass, adminTeamCardHeaderRowClass, adminTeamCardTitleClass, adminTeamCardTitleIconClass } from "@/components/admin/adminThemeClasses"
import TeamNoteBlocksView from "@/components/admin/TeamNoteBlocksView"
import TeamNoteMessageField from "@/components/admin/TeamNoteMessageField"
import TeamNoteReactionButton from "@/components/admin/TeamNoteReactionButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const STICKER_OPTIONS = ["🎉", "🚀", "💪", "☕", "🌿", "✨", "🎯", "💡", "🦖", "🎈", "🌟", "💚", "🙌", "🔥", "👏"] as const

const REACTION_OPTIONS = ["👍", "❤️", "🎉", "🔥", "👏", "😂", "🚀", "☕"] as const

const teamNoteQueryKey = (token: string) => ["admin-team-note", token] as const

const emptyDraft = (): AdminTeamNoteBlock[] => [{ type: "text", text: "" }]

const groupReactions = (reactions: AdminTeamNoteReaction[]) => {
  const map = new Map<string, { count: number; userIds: string[]; userNames: string[] }>()
  for (const reaction of reactions) {
    const existing = map.get(reaction.emoji) ?? { count: 0, userIds: [], userNames: [] }
    existing.count += 1
    existing.userIds.push(reaction.userId)
    const name = reaction.userName?.trim() || "Team member"
    if (!existing.userNames.includes(name)) {
      existing.userNames.push(name)
    }
    map.set(reaction.emoji, existing)
  }
  return [...map.entries()].map(([emoji, meta]) => ({ emoji, ...meta }))
}

const resolvePublisherAvatarUrl = (
  publishedById: string | null | undefined,
  members: AdminTeamUser[],
  currentUserId: string | undefined,
  currentUser: ReturnType<typeof useAuth>["user"],
): string => {
  if (!publishedById) return ""

  const member = members.find((m) => m.id === publishedById)
  if (member) return resolveAdminMemberAvatarUrl(member)

  if (currentUserId === publishedById && currentUser) {
    return getAdminAvatarUrl(currentUser)
  }

  return ""
}

const publisherInitials = (name: string, publishedById: string | null | undefined, members: AdminTeamUser[]) => {
  const trimmed = name.trim()
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase()
    }
    return parts[0]!.charAt(0).toUpperCase()
  }

  const member = members.find((m) => m.id === publishedById)
  if (member?.email) return member.email.charAt(0).toUpperCase()
  return "?"
}

type AdminTeamQuickNoteCardProps = {
  className?: string
  members?: AdminTeamUser[]
}

const AdminTeamQuickNoteCard = ({ className, members = [] }: AdminTeamQuickNoteCardProps) => {
  const { user, session } = useAuth()
  const { resolvedTheme } = useAdminTheme()
  const isDark = resolvedTheme === "dark"
  const token = session?.access_token ?? ""
  const queryClient = useQueryClient()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const reactionFlyBoundsRef = useRef<HTMLDivElement>(null)
  const reactionFlyLayerRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [draftBlocks, setDraftBlocks] = useState<AdminTeamNoteBlock[]>(emptyDraft())
  const [imageUrlDraft, setImageUrlDraft] = useState("")
  const [publishError, setPublishError] = useState<string | null>(null)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [cropSourceFile, setCropSourceFile] = useState<File | null>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imageUrlPopoverOpen, setImageUrlPopoverOpen] = useState(false)

  const noteQuery = useQuery({
    queryKey: teamNoteQueryKey(token),
    queryFn: () => fetchAdminTeamNote(token),
    enabled: Boolean(token),
    staleTime: 30_000,
  })

  const publishMutation = useMutation({
    mutationFn: (blocks: AdminTeamNoteBlock[]) => publishAdminTeamNote(token, blocks),
    onSuccess: (data) => {
      queryClient.setQueryData(teamNoteQueryKey(token), (prev: Awaited<ReturnType<typeof fetchAdminTeamNote>> | undefined) =>
        prev
          ? { ...prev, note: data.note, configured: true }
          : { configured: true, note: data.note, reactions: [] },
      )
      setEditing(false)
      setPublishError(null)
    },
    onError: (err: Error) => setPublishError(err.message),
  })

  const removeMutation = useMutation({
    mutationFn: () => removeAdminTeamNote(token),
    onSuccess: () => {
      queryClient.setQueryData(teamNoteQueryKey(token), (prev: Awaited<ReturnType<typeof fetchAdminTeamNote>> | undefined) =>
        prev
          ? { ...prev, note: null, reactions: [] }
          : { configured: true, note: null, reactions: [] },
      )
      setEditing(false)
      setPublishError(null)
    },
    onError: (err: Error) => setPublishError(err.message),
  })

  const reactionMutation = useMutation({
    mutationFn: (emoji: string) => toggleAdminTeamNoteReaction(token, emoji),
    onMutate: async (emoji) => {
      await queryClient.cancelQueries({ queryKey: teamNoteQueryKey(token) })
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof fetchAdminTeamNote>>>(
        teamNoteQueryKey(token),
      )
      const userId = user?.id
      if (!previous || !userId) return { previous }

      const hasReaction = previous.reactions.some((r) => r.userId === userId && r.emoji === emoji)
      const nextReactions = hasReaction
        ? previous.reactions.filter((r) => !(r.userId === userId && r.emoji === emoji))
        : [
            ...previous.reactions,
            {
              emoji,
              userId,
              userName: getAdminDisplayName(user) || user?.email || "You",
              createdAt: new Date().toISOString(),
            },
          ]

      queryClient.setQueryData(teamNoteQueryKey(token), { ...previous, reactions: nextReactions })
      return { previous }
    },
    onSuccess: (result, emoji) => {
      const userId = user?.id
      if (!userId) return

      queryClient.setQueryData<Awaited<ReturnType<typeof fetchAdminTeamNote>>>(
        teamNoteQueryKey(token),
        (current) => {
          if (!current) return current

          const hasReaction = current.reactions.some((r) => r.userId === userId && r.emoji === emoji)
          if (result.active === hasReaction) return current

          const nextReactions = result.active
            ? [
                ...current.reactions.filter((r) => !(r.userId === userId && r.emoji === emoji)),
                {
                  emoji,
                  userId,
                  userName: getAdminDisplayName(user) || user?.email || "You",
                  createdAt: new Date().toISOString(),
                },
              ]
            : current.reactions.filter((r) => !(r.userId === userId && r.emoji === emoji))

          return { ...current, reactions: nextReactions }
        },
      )
    },
    onError: (_err, _emoji, context) => {
      if (context?.previous) {
        queryClient.setQueryData(teamNoteQueryKey(token), context.previous)
      }
    },
  })

  const note = noteQuery.data?.note
  const reactions = noteQuery.data?.reactions ?? []
  const configured = noteQuery.data?.configured ?? true
  const reactionGroups = useMemo(() => groupReactions(reactions), [reactions])
  const userId = user?.id

  const publisherName = note?.publishedByName?.trim() || "Team member"
  const publisherAvatarUrl = useMemo(
    () => resolvePublisherAvatarUrl(note?.publishedById, members, userId, user),
    [note?.publishedById, members, userId, user],
  )
  const publisherInitialsLabel = useMemo(
    () => publisherInitials(publisherName, note?.publishedById, members),
    [publisherName, note?.publishedById, members],
  )

  const handleStartEdit = () => {
    setDraftBlocks(note?.blocks?.length ? [...note.blocks] : emptyDraft())
    setImageUrlDraft("")
    setImageUploadError(null)
    setPublishError(null)
    setPreviewOpen(false)
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setPublishError(null)
    setImageUploadError(null)
    setCropSourceFile(null)
    setCropDialogOpen(false)
    setImageUrlPopoverOpen(false)
  }

  const handleToggleSticker = (emoji: string) => {
    setDraftBlocks((prev) => {
      const selected = prev.some((block) => block.type === "sticker" && block.emoji === emoji)
      if (selected) {
        return prev.filter((block) => !(block.type === "sticker" && block.emoji === emoji))
      }
      return [...prev, { type: "sticker", emoji }]
    })
  }

  const handleAddImageUrl = () => {
    const url = imageUrlDraft.trim()
    if (!url) return
    setDraftBlocks((prev) => [...prev, { type: "image", url }])
    setImageUrlDraft("")
    setImageUploadError(null)
    setImageUrlPopoverOpen(false)
  }

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setImageUploadError(null)
    setCropSourceFile(file)
    setCropDialogOpen(true)
  }

  const handleImageCropConfirm = async (file: File) => {
    if (!user?.id) {
      setImageUploadError("Sign in to upload an image.")
      return
    }

    setUploadingImage(true)
    setImageUploadError(null)

    try {
      const url = await uploadAdminTeamNoteImage(user.id, file)
      setDraftBlocks((prev) => [...prev, { type: "image", url }])
      setCropSourceFile(null)
    } catch (err) {
      setImageUploadError(err instanceof Error ? err.message : "Could not upload image.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageCropCancel = () => {
    setCropSourceFile(null)
  }

  const handleUpdateText = (text: string) => {
    setDraftBlocks((prev) => {
      const next = [...prev]
      const textIndex = next.findIndex((b) => b.type === "text")
      if (textIndex >= 0) {
        next[textIndex] = { type: "text", text }
        return next
      }
      return [{ type: "text", text }, ...next]
    })
  }

  const handlePublish = () => {
    const cleaned = draftBlocks.filter((block) => {
      if (block.type === "text") return block.text.trim().length > 0
      if (block.type === "image") return block.url.trim().length > 0
      return true
    })
    if (cleaned.length === 0) {
      setPublishError("Add a message, sticker, or image before publishing.")
      return
    }
    publishMutation.mutate(cleaned)
  }

  const draftText =
    draftBlocks.find((b): b is Extract<AdminTeamNoteBlock, { type: "text" }> => b.type === "text")
      ?.text ?? ""

  const selectedStickers = useMemo(
    () =>
      new Set(
        draftBlocks
          .filter((block): block is Extract<AdminTeamNoteBlock, { type: "sticker" }> => block.type === "sticker")
          .map((block) => block.emoji),
      ),
    [draftBlocks],
  )

  const previewBlocks = draftBlocks.filter((block) => block.type !== "text" || block.text.trim())
  const hasPreviewContent = previewBlocks.length > 0

  return (
    <>
      <Card className={cn("flex h-full min-w-0 flex-col overflow-visible rounded-2xl", className)}>
        <CardHeader className={adminTeamCardHeaderClass}>
          <div className={adminTeamCardHeaderRowClass}>
            <CardTitle className={adminTeamCardTitleClass}>
              <Megaphone className={adminTeamCardTitleIconClass} aria-hidden />
              Team bulletin
            </CardTitle>
            {!editing && configured && note?.blocks?.length ? (
              <div className="flex shrink-0 items-center gap-2">
                <AdminDeleteIconButton
                  label="Remove bulletin?"
                  description="This clears the team bulletin and all reactions. You can post a new note anytime."
                  tooltip="Remove bulletin"
                  confirmLabel="Remove bulletin"
                  triggerVariant="outline"
                  onConfirm={async () => {
                    await removeMutation.mutateAsync()
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 rounded-full border-rellia-teal/25 px-3 text-rellia-teal hover:bg-rellia-mint/10 dark:border-rellia-mint/25 dark:text-rellia-mint dark:hover:bg-rellia-mint/10"
                  onClick={handleStartEdit}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Edit
                </Button>
              </div>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className={cn(adminTeamCardContentClass, "space-y-4 overflow-visible")}>
          {noteQuery.isLoading ? (
            <Skeleton className="h-36 w-full rounded-xl" />
          ) : !configured ? (
            <p className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 px-4 py-3 font-urbanist text-sm text-amber-950">
              Run <code className="text-xs font-semibold">scripts/supabase_admin_team_board.sql</code> in
              Supabase to enable the team bulletin board.
            </p>
          ) : editing ? (
            <div className={cn("space-y-4 rounded-2xl p-4", adminHighlightedSurfaceClass)}>
              <div>
                <p className="mb-2 flex items-center gap-1.5 font-urbanist text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Sticker className="h-3.5 w-3.5" aria-hidden />
                  Stickers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STICKER_OPTIONS.map((emoji) => {
                    const selected = selectedStickers.has(emoji)
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleToggleSticker(emoji)}
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-lg transition-colors",
                          "hover:border-rellia-teal/30 hover:bg-rellia-mint/15",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
                          selected
                            ? "border-rellia-teal bg-rellia-mint/25 ring-2 ring-rellia-teal/30"
                            : "border-border",
                        )}
                        aria-pressed={selected}
                        aria-label={`${selected ? "Remove" : "Add"} ${emoji} sticker`}
                      >
                        {emoji}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="team-note-text" className="mb-2 block font-urbanist text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Message
                </label>
                <TeamNoteMessageField
                  id="team-note-text"
                  value={draftText}
                  onChange={handleUpdateText}
                  placeholder="Weekend coverage, shout-out, reminder…"
                />
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 font-urbanist text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <ImagePlus className="h-3.5 w-3.5" aria-hidden />
                  Image
                </p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleImageFileChange}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0 rounded-full"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    {uploadingImage ? "Uploading…" : "Upload image"}
                  </Button>
                  <Popover open={imageUrlPopoverOpen} onOpenChange={setImageUrlPopoverOpen}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full text-rellia-teal hover:bg-rellia-mint/15 hover:text-rellia-teal"
                            aria-label="Paste a URL instead"
                          >
                            <Link2 className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top">Paste a URL instead</TooltipContent>
                    </Tooltip>
                    <PopoverContent
                      align="start"
                      className={cn("w-[min(100vw-2rem,20rem)] p-3", adminPopoverContentForTheme(resolvedTheme))}
                    >
                      <p className="mb-2 font-urbanist text-xs font-semibold text-foreground">Image URL</p>
                      <div className="flex flex-col gap-2">
                        <Input
                          value={imageUrlDraft}
                          onChange={(e) => setImageUrlDraft(e.target.value)}
                          placeholder="https://… or /images/…"
                          className="font-urbanist text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddImageUrl()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-full bg-rellia-teal text-white hover:bg-rellia-teal/90"
                          onClick={handleAddImageUrl}
                          disabled={!imageUrlDraft.trim()}
                        >
                          Add image URL
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {imageUploadError ? (
                  <p className="mt-2 font-urbanist text-sm text-destructive" role="alert">
                    {imageUploadError}
                  </p>
                ) : null}
              </div>

              {hasPreviewContent ? (
                <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
                  <CollapsibleTrigger
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-rellia-teal/15 bg-rellia-mint/10 px-3 py-2.5 font-urbanist text-sm font-semibold text-rellia-teal transition-colors hover:bg-rellia-mint/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40 dark:border-rellia-mint/25 dark:bg-rellia-mint/10 dark:text-rellia-mint dark:hover:bg-rellia-mint/15"
                    aria-expanded={previewOpen}
                  >
                    Preview note
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 transition-transform", previewOpen && "rotate-180")}
                      aria-hidden
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className={cn("rounded-xl p-4", adminHighlightedSurfaceClass)}>
                      <TeamNoteBlocksView blocks={previewBlocks} preview />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : null}

              {publishError ? (
                <p className="font-urbanist text-sm text-destructive" role="alert">
                  {publishError}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full bg-rellia-teal text-white hover:bg-rellia-teal/90"
                  onClick={handlePublish}
                  disabled={publishMutation.isPending || uploadingImage}
                >
                  {publishMutation.isPending ? "Publishing…" : "Publish note"}
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : note?.blocks?.length ? (
            <div ref={reactionFlyBoundsRef} className="relative space-y-4 overflow-visible">
              {publishError ? (
                <p className="font-urbanist text-sm text-destructive" role="alert">
                  {publishError}
                </p>
              ) : null}
              <div
                ref={reactionFlyLayerRef}
                className="pointer-events-none absolute inset-0 z-30 overflow-visible"
                aria-hidden
              />
              <div className={cn("rounded-2xl p-4", adminHighlightedSurfaceClass)}>
                <TeamNoteBlocksView blocks={note.blocks} />
                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0 border border-border/60 dark:border-rellia-mint/20">
                    {publisherAvatarUrl ? <AvatarImage src={publisherAvatarUrl} alt="" /> : null}
                    <AvatarFallback className="bg-rellia-mint/25 font-urbanist text-xs font-semibold text-rellia-teal dark:text-rellia-mint">
                      {publisherInitialsLabel}
                    </AvatarFallback>
                  </Avatar>
                  <p className="min-w-0 font-urbanist text-sm text-muted-foreground dark:text-slate-300">
                    <span className="font-semibold text-foreground/85 dark:text-white">{publisherName}</span>
                    {note.publishedAt ? (
                      <>
                        <span className="mx-1.5">·</span>
                        <time dateTime={note.publishedAt}>{formatAdminRelativeAgo(note.publishedAt)}</time>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 font-urbanist text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reactions
                </p>
                <div className="relative z-10 flex flex-wrap gap-2 overflow-visible">
                  {REACTION_OPTIONS.map((emoji) => {
                    const group = reactionGroups.find((g) => g.emoji === emoji)
                    const active = Boolean(userId && group?.userIds.includes(userId))
                    const reactionButton = (
                      <TeamNoteReactionButton
                        key={emoji}
                        emoji={emoji}
                        active={active}
                        count={group?.count ?? 0}
                        flyBoundsRef={reactionFlyBoundsRef}
                        flyLayerRef={reactionFlyLayerRef}
                        onClick={() => reactionMutation.mutate(emoji)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-urbanist text-sm transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40",
                          active
                            ? "border-rellia-teal/35 bg-rellia-mint/25 text-rellia-teal"
                            : "border-border bg-card text-foreground hover:border-rellia-teal/25 hover:bg-rellia-mint/10",
                        )}
                      />
                    )

                    if (!group || group.count === 0) {
                      return reactionButton
                    }

                    return (
                      <Tooltip key={emoji}>
                        <TooltipTrigger asChild>
                          <span className="inline-flex overflow-visible">{reactionButton}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs font-urbanist text-xs">
                          {group.userNames.join(", ")}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <AdminCompactEmptyState
              icon={MoonStar}
              title="It's quiet in here"
              description="Be the first to post a bulletin note!"
              descriptionClassName="text-base leading-relaxed"
              action={
                <Button
                  type="button"
                  className="h-11 rounded-full bg-rellia-mint px-7 font-urbanist text-base font-semibold text-rellia-teal hover:bg-rellia-mint/90 dark:bg-rellia-mint/25 dark:text-rellia-teal dark:hover:bg-rellia-mint/35"
                  onClick={handleStartEdit}
                >
                  Post bulletin
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <ImageCropDialog
        open={cropDialogOpen}
        file={cropSourceFile}
        title="Crop note image"
        description="Drag to reposition. The image will be added to your note."
        allowAspectChange
        defaultAspectPreset="landscape"
        maxOutputSize={1600}
        variant={isDark ? "dark" : "light"}
        onOpenChange={setCropDialogOpen}
        onConfirm={handleImageCropConfirm}
        onCancel={handleImageCropCancel}
      />
    </>
  )
}

export default AdminTeamQuickNoteCard
