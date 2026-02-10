import { useState } from "react"
import type { RecurringCommitment } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  CalendarClock,
  X,
  Check,
  XCircle,
  Pencil,
  CalendarSync,
  ArrowRight,
} from "lucide-react"

interface CommitmentListProps {
  commitments: RecurringCommitment[]
  onAdd: (commitment: RecurringCommitment) => void
  onRemove: (title: string) => void
  onConfirm?: (title: string) => void
  onDismiss?: (title: string) => void
}

function SourceBadge({ source }: { source: RecurringCommitment["source"] }) {
  if (source === "calendar-inferred") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 text-[10px] font-normal text-indigo-600 dark:text-indigo-400"
      >
        <CalendarSync className="h-2.5 w-2.5" />
        Calendar
      </Badge>
    )
  }
  if (source === "calendar-confirmed") {
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
        <CalendarSync className="h-2.5 w-2.5" />
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

function ConfidenceIndicator({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  return (
    <span
      className={`text-[10px] font-medium ${
        pct >= 90
          ? "text-green-600 dark:text-green-400"
          : pct >= 75
            ? "text-amber-600 dark:text-amber-400"
            : "text-muted-foreground"
      }`}
    >
      {pct}% confidence
    </span>
  )
}

export default function CommitmentList({
  commitments,
  onAdd,
  onRemove,
  onConfirm,
  onDismiss,
}: CommitmentListProps) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState("")
  const [frequency, setFrequency] = useState("")
  const [notes, setNotes] = useState("")

  const confirmed = commitments.filter((c) => c.status === "confirmed")
  const suggested = commitments.filter((c) => c.status === "suggested")

  const handleAdd = () => {
    if (!title.trim() || !frequency.trim()) return
    onAdd({
      title: title.trim(),
      frequency: frequency.trim(),
      notes: notes.trim(),
      source: "manual",
      status: "confirmed",
    })
    setTitle("")
    setFrequency("")
    setNotes("")
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      {/* ── Calendar-Inferred Suggestions ── */}
      {suggested.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-2 dark:border-indigo-800 dark:bg-indigo-950/20">
            <CalendarSync className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
              Detected from Calendar
            </span>
            <span className="text-[10px] text-indigo-500">
              {suggested.length} recurring pattern{suggested.length > 1 ? "s" : ""} detected
            </span>
          </div>

          {suggested.map((commitment) => (
            <Card
              key={commitment.title}
              className="gap-0 border-indigo-100 bg-indigo-50/30 p-4 dark:border-indigo-900 dark:bg-indigo-950/10"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <CalendarClock className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {commitment.title}
                      </p>
                      <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {commitment.frequency}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 border-green-200 text-xs text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                        onClick={() => onConfirm?.(commitment.title)}
                      >
                        <Check className="h-3 w-3" />
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs text-muted-foreground"
                        onClick={() => onDismiss?.(commitment.title)}
                      >
                        <XCircle className="h-3 w-3" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                    {commitment.nextOccurrence && (
                      <span className="flex items-center gap-1">
                        <ArrowRight className="h-2.5 w-2.5" />
                        Next: {commitment.nextOccurrence}
                      </span>
                    )}
                    {commitment.confidence !== undefined && (
                      <ConfidenceIndicator confidence={commitment.confidence} />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Confirmed Commitments ── */}
      {confirmed.length > 0 && (
        <div className="space-y-2">
          {suggested.length > 0 && (
            <p className="text-xs font-semibold text-muted-foreground">
              Confirmed Commitments
            </p>
          )}
          {confirmed.map((commitment) => (
            <Card key={commitment.title} className="gap-0 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">
                          {commitment.title}
                        </p>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {commitment.frequency}
                        </p>
                      </div>
                      <SourceBadge source={commitment.source} />
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
                  {commitment.nextOccurrence && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ArrowRight className="h-2.5 w-2.5" />
                      Next: {commitment.nextOccurrence}
                    </p>
                  )}
                  {commitment.notes && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {commitment.notes}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Add Commitment ── */}
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
