import type { Partner } from "@/data/types"
import { cn } from "@/lib/utils"

interface PartnerAvatarProps {
  partner: Partner
  size?: "sm" | "md" | "lg"
  showInfo?: boolean
  className?: string
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
}

export default function PartnerAvatar({
  partner,
  size = "md",
  showInfo = false,
  className,
}: PartnerAvatarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
          sizeMap[size]
        )}
        style={{ backgroundColor: partner.colorAccent }}
      >
        {partner.initials}
      </div>
      {showInfo && (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{partner.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {partner.role}, {partner.location}
          </p>
          {partner.coverageStatus === "coverage" && partner.coverageName && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              Coverage: {partner.coverageName}
            </p>
          )}
          {partner.coverageStatus === "no-coverage" && (
            <p className="text-[11px] text-red-600 dark:text-red-400">No coverage</p>
          )}
        </div>
      )}
    </div>
  )
}
