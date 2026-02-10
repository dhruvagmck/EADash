import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface EADecisionInputProps {
  hasSelection: boolean
  onResolve?: (note: string) => void
}

export default function EADecisionInput({
  hasSelection,
  onResolve,
}: EADecisionInputProps) {
  const [note, setNote] = useState("")
  const [customMode, setCustomMode] = useState(false)

  return (
    <div className="space-y-3 border-t pt-4">
      <Textarea
        placeholder="Add a note about your decision (optional)..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[72px] resize-none text-sm"
      />

      {customMode && (
        <div className="rounded-lg border bg-muted p-3">
          <Textarea
            placeholder="Describe your custom resolution..."
            className="mb-2 min-h-[60px] resize-none text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              Open in Outlook
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Open SkyLink
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Open Aurora
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCustomMode((c) => !c)}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          {customMode ? "Back to options" : "I'll handle this differently"}
        </button>
        <Button
          disabled={!hasSelection && !customMode}
          onClick={() => onResolve?.(note)}
          className="gap-1.5 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4" />
          Resolve
        </Button>
      </div>
    </div>
  )
}
