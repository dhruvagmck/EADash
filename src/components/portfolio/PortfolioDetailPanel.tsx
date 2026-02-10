import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import DomainIcon from "@/components/shared/DomainIcon"
import SeverityBadge from "@/components/shared/SeverityBadge"
import type { SignalBlockData } from "@/data/types"
import { DOMAIN_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { partners } from "@/data/partners"
import { useDashboardActions } from "@/store/DashboardContext"
import { toast } from "sonner"
import {
  Check,
  Pencil,
  ExternalLink,
  X,
  Clock,
  ArrowUpRight,
} from "lucide-react"

interface PortfolioDetailPanelProps {
  signal: SignalBlockData | null
  open: boolean
  onClose: () => void
}

export default function PortfolioDetailPanel({
  signal,
  open,
  onClose,
}: PortfolioDetailPanelProps) {
  const { dismissSignalItem } = useDashboardActions()

  if (!signal) return null

  const partner = partners.find((p) => p.id === signal.partnerId)
  const config = DOMAIN_CONFIG[signal.domain]

  const handleApprove = (index: number) => {
    dismissSignalItem(signal.id, index)
    toast.success("Approved", {
      description: signal.detailItems[index],
    })
  }

  const handleReject = (index: number) => {
    dismissSignalItem(signal.id, index)
    toast.error("Rejected", {
      description: signal.detailItems[index],
    })
  }

  const handleSnooze = (index: number) => {
    toast.info("Snoozed", {
      description: `${signal.detailItems[index]} — will resurface in 1 hour.`,
    })
  }

  const handleEscalate = (index: number) => {
    dismissSignalItem(signal.id, index)
    toast.info("Escalated", {
      description: `Escalated to ${partner?.name ?? "Partner"}.`,
    })
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[420px]">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DomainIcon domain={signal.domain} size={20} />
            <SheetTitle className="text-base">
              {config.label} — {partner?.name}
            </SheetTitle>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <SeverityBadge severity={signal.severity} />
            <span className="text-xs text-muted-foreground">
              {signal.count} item{signal.count !== 1 ? "s" : ""}
            </span>
          </div>
        </SheetHeader>

        <Separator />

        <div className="space-y-3 py-4">
          {signal.detailItems.map((item, i) => {
            const isUrgent = item.startsWith("URGENT:")

            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border p-3 text-sm",
                  isUrgent &&
                    "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                )}
              >
                <p
                  className={cn(
                    isUrgent
                      ? "font-medium text-red-800 dark:text-red-300"
                      : "text-foreground"
                  )}
                >
                  {item}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs text-green-700 dark:text-green-400"
                    onClick={() => handleApprove(i)}
                  >
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs"
                    onClick={() => handleApprove(i)}
                  >
                    <Pencil className="h-3 w-3" /> Modify
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs text-red-600 dark:text-red-400"
                    onClick={() => handleReject(i)}
                  >
                    <X className="h-3 w-3" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs text-muted-foreground"
                    onClick={() => handleSnooze(i)}
                  >
                    <Clock className="h-3 w-3" /> Snooze
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs text-muted-foreground"
                    onClick={() => handleEscalate(i)}
                  >
                    <ArrowUpRight className="h-3 w-3" /> Escalate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs text-muted-foreground"
                    onClick={() =>
                      toast.info("Opening in external system...")
                    }
                  >
                    <ExternalLink className="h-3 w-3" /> Open
                  </Button>
                </div>
              </div>
            )
          })}

          {signal.detailItems.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No items need your attention. All automations running within
              authority.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
