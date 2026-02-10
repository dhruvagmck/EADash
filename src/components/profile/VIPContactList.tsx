import { useState } from "react"
import type { VIPContact } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus,
  User,
  X,
  Mail,
  Calendar,
  Check,
  XCircle,
  Sparkles,
  Pencil,
  MailOpen,
} from "lucide-react"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface VIPContactListProps {
  contacts: VIPContact[]
  onAdd: (contact: VIPContact) => void
  onRemove: (contactName: string) => void
  onConfirm?: (contactName: string) => void
  onDismiss?: (contactName: string) => void
}

function SourceBadge({ source }: { source: VIPContact["source"] }) {
  if (source === "outlook-inferred") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 text-[10px] font-normal text-indigo-600 dark:text-indigo-400"
      >
        <Sparkles className="h-2.5 w-2.5" />
        Outlook
      </Badge>
    )
  }
  if (source === "outlook-confirmed") {
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
        <MailOpen className="h-2.5 w-2.5" />
        Confirmed
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 text-[10px] font-normal">
      <Pencil className="h-2.5 w-2.5" />
      Manual
    </Badge>
  )
}

function InteractionStats({
  stats,
}: {
  stats: NonNullable<VIPContact["interactionStats"]>
}) {
  return (
    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <Mail className="h-2.5 w-2.5" />
        {stats.emailCount30d} emails (30d)
      </span>
      <span className="flex items-center gap-1">
        <Calendar className="h-2.5 w-2.5" />
        {stats.meetingCount30d} meetings (30d)
      </span>
      <span>Last: {stats.lastInteraction}</span>
    </div>
  )
}

export default function VIPContactList({
  contacts,
  onAdd,
  onRemove,
  onConfirm,
  onDismiss,
}: VIPContactListProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState("")
  const [relationship, setRelationship] = useState("")
  const [notes, setNotes] = useState("")

  const confirmed = contacts.filter((c) => c.status === "confirmed")
  const suggested = contacts.filter((c) => c.status === "suggested")

  const handleAdd = () => {
    if (!name.trim() || !relationship.trim()) return
    onAdd({
      name: name.trim(),
      relationship: relationship.trim(),
      notes: notes.trim(),
      source: "manual",
      status: "confirmed",
    })
    setName("")
    setRelationship("")
    setNotes("")
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      {/* ── Outlook-Inferred Suggestions ── */}
      {suggested.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-2 dark:border-indigo-800 dark:bg-indigo-950/20">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
              Suggested from Outlook
            </span>
            <span className="text-[10px] text-indigo-500">
              {suggested.length} contact{suggested.length > 1 ? "s" : ""} detected from interaction history
            </span>
          </div>

          {suggested.map((contact) => (
            <Card
              key={contact.name}
              className="gap-0 border-indigo-100 bg-indigo-50/30 p-4 dark:border-indigo-900 dark:bg-indigo-950/10"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  {contact.avatarUrl && (
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-indigo-100 text-xs font-medium text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.relationship}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 border-green-200 text-xs text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                        onClick={() => onConfirm?.(contact.name)}
                      >
                        <Check className="h-3 w-3" />
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs text-muted-foreground"
                        onClick={() => onDismiss?.(contact.name)}
                      >
                        <XCircle className="h-3 w-3" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  {contact.interactionStats && (
                    <InteractionStats stats={contact.interactionStats} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Confirmed Contacts ── */}
      {confirmed.length > 0 && (
        <div className="space-y-2">
          {suggested.length > 0 && (
            <p className="text-xs font-semibold text-muted-foreground">
              Confirmed Contacts
            </p>
          )}
          {confirmed.map((contact) => (
            <Card key={contact.name} className="gap-0 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  {contact.avatarUrl && (
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.relationship}
                        </p>
                      </div>
                      <SourceBadge source={contact.source} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
                      onClick={() => onRemove(contact.name)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {contact.interactionStats && (
                    <InteractionStats stats={contact.interactionStats} />
                  )}
                  {contact.notes && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {contact.notes}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Add Contact ── */}
      {adding ? (
        <div className="space-y-2 rounded-lg border border-dashed p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs"
              autoFocus
            />
            <Input
              placeholder="Relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="h-8 text-xs"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs">
              Add Contact
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAdding(false)
                setName("")
                setRelationship("")
                setNotes("")
              }}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full gap-2 border-dashed text-muted-foreground hover:text-foreground"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      )}
    </div>
  )
}
