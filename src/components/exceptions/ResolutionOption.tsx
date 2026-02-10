import type { ResolutionOption as ResolutionOptionType } from "@/data/types"
import ConfidenceTag from "@/components/shared/ConfidenceTag"
import { cn } from "@/lib/utils"

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
  const isRecommended = option.confidence === "Recommended"

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-1 flex-col rounded-lg border p-4 text-left transition-all",
        isSelected
          ? "border-border bg-muted shadow-sm ring-1 ring-ring"
          : "hover:border-border hover:bg-muted/50",
        isRecommended && !isSelected && "border-green-200 dark:border-green-800"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{option.title}</h4>
        <ConfidenceTag confidence={option.confidence} />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {option.description}
      </p>

      <div className="mt-3 space-y-2 border-t pt-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Trade-offs
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {option.tradeoffs}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Downstream effects
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {option.downstreamEffects}
          </p>
        </div>
      </div>
    </button>
  )
}
