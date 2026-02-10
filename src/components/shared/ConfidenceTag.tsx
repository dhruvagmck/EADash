import { CONFIDENCE_STYLES } from "@/lib/constants"
import type { ConfidenceLevel } from "@/data/types"
import { cn } from "@/lib/utils"

interface ConfidenceTagProps {
  confidence: ConfidenceLevel
  className?: string
}

export default function ConfidenceTag({ confidence, className }: ConfidenceTagProps) {
  const style = CONFIDENCE_STYLES[confidence]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        style.bg,
        style.text,
        className
      )}
    >
      {confidence}
    </span>
  )
}
