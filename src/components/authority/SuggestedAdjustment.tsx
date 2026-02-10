import { Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuggestedAdjustmentProps {
  suggestion: string
  onAccept?: () => void
  onDismiss?: () => void
}

export default function SuggestedAdjustment({
  suggestion,
  onAccept,
  onDismiss,
}: SuggestedAdjustmentProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5 dark:border-blue-800 dark:bg-blue-950">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
      <p className="flex-1 text-xs leading-relaxed text-blue-800 dark:text-blue-300">
        {suggestion}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-[11px] text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
          onClick={onAccept}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
