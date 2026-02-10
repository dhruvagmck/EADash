import { AUTHORITY_STYLES } from "@/lib/constants"
import type { AuthorityLevel } from "@/data/types"
import { cn } from "@/lib/utils"

interface AuthorityToggleProps {
  level: AuthorityLevel
  onChange?: (level: AuthorityLevel) => void
  className?: string
}

const LEVELS: AuthorityLevel[] = ["CAN", "SHOULD", "CANNOT"]

export default function AuthorityToggle({
  level,
  onChange,
  className,
}: AuthorityToggleProps) {
  const isInteractive = !!onChange

  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-md border text-xs font-semibold",
        className
      )}
    >
      {LEVELS.map((l) => {
        const style = AUTHORITY_STYLES[l]
        const isActive = l === level
        return (
          <button
            key={l}
            type="button"
            disabled={!isInteractive}
            onClick={() => onChange?.(l)}
            className={cn(
              "px-2.5 py-1 transition-colors",
              isInteractive ? "cursor-pointer" : "cursor-default",
              isActive
                ? cn(style.activeBg, style.activeText)
                : cn(
                    style.bg,
                    style.text,
                    "opacity-40",
                    isInteractive && "hover:opacity-70"
                  )
            )}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}
