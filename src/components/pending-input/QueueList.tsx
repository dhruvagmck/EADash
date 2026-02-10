import { useMemo } from "react"
import type { PendingInputItem } from "@/data/types"
import { partners } from "@/data/partners"
import QueueCard from "./QueueCard"
import { Button } from "@/components/ui/button"
import { CheckSquare } from "lucide-react"

interface QueueListProps {
  items: PendingInputItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onApprove?: (id: string) => void
  onBatchApproveLowRisk?: () => void
  /** null = showing all partners (grouped), string = single partner view */
  selectedPartnerId?: string | null
}

export default function QueueList({
  items,
  selectedId,
  onSelect,
  onApprove,
  onBatchApproveLowRisk,
  selectedPartnerId = null,
}: QueueListProps) {
  // Group items by partner when viewing all
  const groupedItems = useMemo(() => {
    if (selectedPartnerId) return null // not needed for single-partner view
    const groups: { partner: (typeof partners)[number]; items: PendingInputItem[] }[] = []
    for (const partner of partners) {
      const partnerItems = items.filter((i) => i.partnerId === partner.id)
      if (partnerItems.length > 0) {
        groups.push({ partner, items: partnerItems })
      }
    }
    return groups
  }, [items, selectedPartnerId])

  return (
    <div className="flex min-h-0 flex-1 flex-col border-r">
      {/* Batch controls */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
        <span className="text-sm font-medium whitespace-nowrap">
          {items.length} item{items.length !== 1 ? "s" : ""} awaiting review
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={onBatchApproveLowRisk}
        >
          <CheckSquare className="h-3.5 w-3.5 shrink-0" />
          <span className="whitespace-nowrap">Approve all low-risk</span>
        </Button>
      </div>

      {/* Scrollable list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {/* Grouped view (all partners) */}
          {groupedItems
            ? groupedItems.map(({ partner, items: partnerItems }) => (
                <div key={partner.id}>
                  {/* Partner group header */}
                  <div className="flex items-center gap-2 px-2 pt-3 pb-1.5 first:pt-1">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ backgroundColor: partner.colorAccent }}
                    >
                      {partner.initials}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {partner.name}
                    </span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {partnerItems.length}
                    </span>
                    <div className="flex-1 border-t border-border/50" />
                  </div>
                  {partnerItems.map((item) => (
                    <QueueCard
                      key={item.id}
                      item={item}
                      isSelected={item.id === selectedId}
                      onClick={() => onSelect(item.id)}
                      onApprove={() => onApprove?.(item.id)}
                    />
                  ))}
                </div>
              ))
            : /* Flat view (single partner) */
              items.map((item) => (
                <QueueCard
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  onClick={() => onSelect(item.id)}
                  onApprove={() => onApprove?.(item.id)}
                />
              ))}

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No items need your review.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                All automations running within authority.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
