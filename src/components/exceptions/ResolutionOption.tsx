import { useState } from "react"
import type { ResolutionOption as ResolutionOptionType } from "@/data/types"
import ConfidenceTag from "@/components/shared/ConfidenceTag"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ResolutionOptionProps {
  option: ResolutionOptionType
  isSelected: boolean
  onSelect: () => void
}

export default function ResolutionOption({
  option,
  isSelected,
  onSelect,
}: ResolutionOptionProps) {
  const [showDetails, setShowDetails] = useState(false)
  const isRecommended = option.confidence === "Recommended"

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-1 flex-col rounded-lg border p-3 text-left transition-all",
        isSelected
          ? "border-border bg-muted shadow-sm ring-1 ring-ring"
          : "hover:border-border hover:bg-muted/50",
        isRecommended && !isSelected && "border-green-200 dark:border-green-800"
      )}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{option.title}</h4>
        <ConfidenceTag confidence={option.confidence} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {option.description}
      </p>

      {/* Collapsible trade-offs and downstream effects */}
      <span
        onClick={(e) => {
          e.stopPropagation()
          setShowDetails(!showDetails)
        }}
        className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
      >
        {showDetails ? "Hide details" : "Trade-offs & effects"}
        {showDetails ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </span>

      {showDetails && (
        <div className="mt-2 space-y-1.5 border-t pt-2">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">
              Trade-offs
            </p>
            <p className="text-xs text-muted-foreground">
              {option.tradeoffs}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">
              Downstream
            </p>
            <p className="text-xs text-muted-foreground">
              {option.downstreamEffects}
            </p>
          </div>
        </div>
      )}
    </button>
  )
}
