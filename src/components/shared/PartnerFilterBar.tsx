import type { Partner } from "@/data/types"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"

interface PartnerFilterBarProps {
  partners: Partner[]
  selectedPartnerId: string | null
  onSelectPartner: (partnerId: string | null) => void
  partnerCounts: Record<string, number>
  totalCount: number
  /** If true (default), show an "All" pill. Set false for single-partner views. */
  showAll?: boolean
}

export default function PartnerFilterBar({
  partners,
  selectedPartnerId,
  onSelectPartner,
  partnerCounts,
  totalCount,
  showAll = true,
}: PartnerFilterBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-muted/30 px-4 py-2">
      <span className="mr-1 text-xs font-medium text-muted-foreground">
        View by partner:
      </span>

      {/* All partners pill */}
      {showAll && (
        <button
          onClick={() => onSelectPartner(null)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
            selectedPartnerId === null
              ? "bg-foreground text-background shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <Users className="h-3 w-3" />
          All
          <span
            className={cn(
              "ml-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
              selectedPartnerId === null
                ? "bg-background/20 text-background"
                : "bg-muted-foreground/15 text-muted-foreground"
            )}
          >
            {totalCount}
          </span>
        </button>
      )}

      {/* Individual partner pills */}
      {partners.map((partner) => {
        const count = partnerCounts[partner.id] || 0
        const isActive = selectedPartnerId === partner.id

        return (
          <button
            key={partner.id}
            onClick={() => onSelectPartner(partner.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "shadow-sm text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
            style={
              isActive
                ? { backgroundColor: partner.colorAccent }
                : undefined
            }
          >
            {/* Mini avatar */}
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white",
                isActive && "ring-1 ring-white/30"
              )}
              style={{ backgroundColor: isActive ? "rgba(255,255,255,0.25)" : partner.colorAccent }}
            >
              {partner.initials}
            </span>
            {partner.name}
            {count > 0 && (
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted-foreground/15 text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
