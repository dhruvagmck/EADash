import type { SupervisionItem } from "@/data/types"
import QueueCard from "./QueueCard"
import { Button } from "@/components/ui/button"
import { CheckSquare } from "lucide-react"

interface QueueListProps {
  items: SupervisionItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onApprove?: (id: string) => void
}

export default function QueueList({
  items,
  selectedId,
  onSelect,
  onApprove,
}: QueueListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border-r">
      {/* Batch controls */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
        <span className="text-sm font-medium whitespace-nowrap">
          {items.length} item{items.length !== 1 ? "s" : ""} awaiting review
        </span>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <CheckSquare className="h-3.5 w-3.5 shrink-0" />
          <span className="whitespace-nowrap">Select all low-risk</span>
        </Button>
      </div>

      {/* Scrollable list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {items.map((item) => (
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
