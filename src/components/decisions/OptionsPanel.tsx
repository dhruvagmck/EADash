import type { ResolutionOption as ResolutionOptionType } from "@/data/types"
import ResolutionOption from "./ResolutionOption"

interface OptionsPanelProps {
  options: ResolutionOptionType[]
  selectedOptionId: string | null
  onSelect: (id: string) => void
}

export default function OptionsPanel({
  options,
  selectedOptionId,
  onSelect,
}: OptionsPanelProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Resolution Options
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <ResolutionOption
            key={option.id}
            option={option}
            isSelected={option.id === selectedOptionId}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  )
}
