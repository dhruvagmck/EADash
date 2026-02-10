import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowRightLeft, AlertTriangle, Pencil, Check, X } from "lucide-react"

interface CoverageHandoffProps {
  handoffText: string
  escalationNotes: string
  onUpdateHandoff: (text: string) => void
  onUpdateEscalation: (text: string) => void
}

export default function CoverageHandoff({
  handoffText,
  escalationNotes,
  onUpdateHandoff,
  onUpdateEscalation,
}: CoverageHandoffProps) {
  const [editingHandoff, setEditingHandoff] = useState(false)
  const [editingEscalation, setEditingEscalation] = useState(false)
  const [handoffDraft, setHandoffDraft] = useState(handoffText)
  const [escalationDraft, setEscalationDraft] = useState(escalationNotes)

  return (
    <div className="space-y-4">
      {/* Escalation Notes */}
      <Card className="gap-0 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold">Escalation Rules</h3>
          </div>
          {!editingEscalation && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => {
                setEscalationDraft(escalationNotes)
                setEditingEscalation(true)
              }}
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          )}
        </div>
        {editingEscalation ? (
          <div className="space-y-2">
            <Textarea
              value={escalationDraft}
              onChange={(e) => setEscalationDraft(e.target.value)}
              className="min-h-[100px] text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => {
                  onUpdateEscalation(escalationDraft)
                  setEditingEscalation(false)
                }}
              >
                <Check className="h-3 w-3" />
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 text-xs"
                onClick={() => setEditingEscalation(false)}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {escalationNotes || "No escalation notes defined."}
          </p>
        )}
      </Card>

      {/* Coverage Handoff */}
      <Card className="gap-0 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-semibold">Coverage Handoff Notes</h3>
          </div>
          {!editingHandoff && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => {
                setHandoffDraft(handoffText)
                setEditingHandoff(true)
              }}
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          )}
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          These notes are shared with incoming coverage EAs when this partner's
          coverage changes.
        </p>
        {editingHandoff ? (
          <div className="space-y-2">
            <Textarea
              value={handoffDraft}
              onChange={(e) => setHandoffDraft(e.target.value)}
              className="min-h-[120px] text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => {
                  onUpdateHandoff(handoffDraft)
                  setEditingHandoff(false)
                }}
              >
                <Check className="h-3 w-3" />
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 text-xs"
                onClick={() => setEditingHandoff(false)}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {handoffText || "No handoff notes yet."}
          </p>
        )}
      </Card>
    </div>
  )
}
