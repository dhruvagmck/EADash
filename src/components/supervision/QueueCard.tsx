import type { SupervisionItem } from "@/data/types"
import { partners } from "@/data/partners"
import DomainIcon from "@/components/shared/DomainIcon"
import TimeIndicator from "@/components/shared/TimeIndicator"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Check, Pencil } from "lucide-react"

interface QueueCardProps {
  item: SupervisionItem
  isSelected: boolean
  onClick: () => void
  onApprove?: () => void
}

export default function QueueCard({
  item,
  isSelected,
  onClick,
  onApprove,
}: QueueCardProps) {
  const partner = partners.find((p) => p.id === item.partnerId)

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
        isSelected
          ? "border-border bg-muted shadow-sm"
          : "border-transparent hover:bg-muted"
      )}
    >
      {/* Partner color bar */}
      <div
        className="absolute left-0 top-3 h-8 w-1 rounded-r"
        style={{ backgroundColor: partner?.colorAccent }}
      />

      {/* Checkbox */}
      <Checkbox className="mt-0.5 ml-2 shrink-0" onClick={(e) => e.stopPropagation()} />

      {/* Domain icon */}
      <DomainIcon domain={item.domain} size={18} className="mt-0.5 shrink-0" />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">{item.title}</p>
        <p className="mt-1 truncate text-xs text-amber-700 dark:text-amber-400">
          {item.authorityTag}
        </p>
      </div>

      {/* Right side */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <TimeIndicator timeAgo={item.timeAgo} minutesAgo={item.minutesAgo} />
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            className="h-6 gap-1 px-2 text-[11px] text-green-700 dark:text-green-400"
            onClick={(e) => {
              e.stopPropagation()
              onApprove?.()
            }}
          >
            <Check className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">Approve</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 gap-1 px-2 text-[11px]"
            onClick={(e) => {
              e.stopPropagation()
              onApprove?.()
            }}
          >
            <Pencil className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">Modify</span>
          </Button>
        </div>
      </div>
    </button>
  )
}
