import { useState } from "react"
import type { DeskNote } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Pin, PinOff, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeskNoteLogProps {
  notes: DeskNote[]
  onAdd: (note: DeskNote) => void
  onTogglePin: (noteId: string) => void
}

export default function DeskNoteLog({
  notes,
  onAdd,
  onTogglePin,
}: DeskNoteLogProps) {
  const [composing, setComposing] = useState(false)
  const [newContent, setNewContent] = useState("")

  // Pinned first, then reverse-chronological
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0 // maintain insertion order (newest first from context)
  })

  const handleAdd = () => {
    if (!newContent.trim()) return
    const note: DeskNote = {
      id: `dn-new-${Date.now()}`,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      author: "You",
      content: newContent.trim(),
      pinned: false,
    }
    onAdd(note)
    setNewContent("")
    setComposing(false)
  }

  return (
    <div className="space-y-3">
      {/* Compose area */}
      {composing ? (
        <div className="space-y-2 rounded-lg border border-dashed p-3">
          <Textarea
            placeholder="Add a desk note..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="min-h-[80px] text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs">
              Add Note
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setComposing(false)
                setNewContent("")
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
          onClick={() => setComposing(true)}
        >
          <Plus className="h-4 w-4" />
          Add Desk Note
        </Button>
      )}

      {/* Notes list */}
      {sortedNotes.map((note) => (
        <div
          key={note.id}
          className={cn(
            "relative rounded-lg border p-4 transition-colors",
            note.pinned
              ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30"
              : "bg-card"
          )}
        >
          {/* Pin indicator */}
          <button
            onClick={() => onTogglePin(note.id)}
            className={cn(
              "absolute right-3 top-3 rounded p-1 transition-colors",
              note.pinned
                ? "text-amber-600 hover:text-amber-700 dark:text-amber-400"
                : "text-muted-foreground/40 hover:text-muted-foreground"
            )}
            title={note.pinned ? "Unpin note" : "Pin note"}
          >
            {note.pinned ? (
              <Pin className="h-3.5 w-3.5" />
            ) : (
              <PinOff className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Header */}
          <div className="mb-2 flex items-center gap-2 pr-8">
            <span className="text-xs font-medium">{note.author}</span>
            <span className="text-[10px] text-muted-foreground">
              {note.timestamp}
            </span>
            {note.pinned && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                Pinned
              </span>
            )}
          </div>

          {/* Content */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {note.content}
          </p>
        </div>
      ))}

      {notes.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No desk notes yet. Add a note to start documenting partner context.
        </p>
      )}
    </div>
  )
}
