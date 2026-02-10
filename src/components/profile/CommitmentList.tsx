import { useState } from "react"
import type { RecurringCommitment } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, CalendarClock, X } from "lucide-react"

interface CommitmentListProps {
  commitments: RecurringCommitment[]
  onAdd: (commitment: RecurringCommitment) => void
  onRemove: (title: string) => void
}

export default function CommitmentList({
  commitments,
  onAdd,
  onRemove,
}: CommitmentListProps) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState("")
  const [frequency, setFrequency] = useState("")
  const [notes, setNotes] = useState("")

  const handleAdd = () => {
    if (!title.trim() || !frequency.trim()) return
    onAdd({
      title: title.trim(),
      frequency: frequency.trim(),
      notes: notes.trim(),
    })
    setTitle("")
    setFrequency("")
    setNotes("")
    setAdding(false)
  }

  return (
    <div className="space-y-3">
      {commitments.map((commitment) => (
        <Card key={commitment.title} className="gap-0 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{commitment.title}</p>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {commitment.frequency}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 transition-opacity hover:opacity-100"
                  onClick={() => onRemove(commitment.title)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              {commitment.notes && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {commitment.notes}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}

      {adding ? (
        <div className="space-y-2 rounded-lg border border-dashed p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Commitment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 text-xs"
              autoFocus
            />
            <Input
              placeholder="Frequency (e.g. Weekly)"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
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
              Add Commitment
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAdding(false)
                setTitle("")
                setFrequency("")
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
          Add Commitment
        </Button>
      )}
    </div>
  )
}
