import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShieldCheck, Eye, X } from "lucide-react"
import { toast } from "sonner"

interface EADecisionInputProps {
  hasSelection: boolean
  onResolve?: (note: string) => void
  isPrediction?: boolean
  onPrestage?: () => void
  onDismissPrediction?: () => void
}

export default function EADecisionInput({
  hasSelection,
  onResolve,
  isPrediction,
  onPrestage,
  onDismissPrediction,
}: EADecisionInputProps) {
  const [note, setNote] = useState("")
  const [customMode, setCustomMode] = useState(false)

  return (
    <div className="space-y-3 border-t pt-4">
      <Textarea
        placeholder={
          isPrediction
            ? "Add a note about your pre-staging decision (optional)..."
            : "Add a note about your decision (optional)..."
        }
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[72px] resize-none text-sm"
      />

      {!isPrediction && customMode && (
        <div className="rounded-lg border bg-muted p-3">
          <Textarea
            placeholder="Describe your custom resolution..."
            className="mb-2 min-h-[60px] resize-none text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                window.open("https://outlook.office.com", "_blank", "noopener")
                toast.info("Opening Outlook", {
                  description: "Launching Outlook in a new tab…",
                })
              }}
            >
              Open in Outlook
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                window.open("https://skylink.example.com", "_blank", "noopener")
                toast.info("Opening SkyLink", {
                  description: "Launching SkyLink booking system…",
                })
              }}
            >
              Open SkyLink
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                window.open("https://aurora.example.com", "_blank", "noopener")
                toast.info("Opening Aurora", {
                  description: "Launching Aurora expense system…",
                })
              }}
            >
              Open Aurora
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        {isPrediction ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                onDismissPrediction?.()
                toast.info("Prediction dismissed")
              }}
            >
              <X className="h-3.5 w-3.5" />
              Dismiss Prediction
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => {
                  toast.info("Monitoring — you'll be alerted if this develops")
                }}
              >
                <Eye className="h-3.5 w-3.5" />
                Monitor
              </Button>
              <Button
                disabled={!hasSelection}
                onClick={() => {
                  onPrestage?.()
                  toast.success("Response pre-staged", {
                    description: "Will activate automatically if this event occurs",
                  })
                }}
                className="gap-1.5 bg-green-600 hover:bg-green-700"
              >
                <ShieldCheck className="h-4 w-4" />
                Pre-stage Response
              </Button>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
