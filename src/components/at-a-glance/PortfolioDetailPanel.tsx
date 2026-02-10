import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DomainIcon from "@/components/shared/DomainIcon"
import SeverityBadge from "@/components/shared/SeverityBadge"
import type { SignalBlockData } from "@/data/types"
import { DOMAIN_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { partners } from "@/data/partners"
import { useDashboardActions } from "@/store/DashboardProvider"
import { toast } from "sonner"
import {
  Check,
  X,
  MoreHorizontal,
  Clock,
  ArrowUpRight,
  ExternalLink,
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
                <div className="mt-2 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    className="h-7 gap-1 bg-green-600 text-xs hover:bg-green-700"
                    onClick={() => handleApprove(i)}
                  >
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs text-red-600 dark:text-red-400"
                    onClick={() => handleReject(i)}
                  >
                    <X className="h-3 w-3" /> Reject
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSnooze(i)}>
                        <Clock className="mr-2 h-3.5 w-3.5" />
                        Snooze 1 hour
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEscalate(i)}>
                        <ArrowUpRight className="mr-2 h-3.5 w-3.5" />
                        Escalate to Partner
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const systemUrls: Record<string, { name: string; url: string }> = {
                            "client-facing": { name: "SharePoint", url: "https://sharepoint.example.com" },
                            "internal-scheduling": { name: "Outlook Calendar", url: "https://outlook.office.com/calendar" },
                            "travel-expenses": { name: "SkyLink", url: "https://skylink.example.com" },
                            timesheets: { name: "Aurora", url: "https://aurora.example.com" },
                            "email-triage": { name: "Outlook", url: "https://outlook.office.com" },
                          }
                          const system = systemUrls[signal.domain] ?? { name: "source system", url: "https://outlook.office.com" }
                          window.open(system.url, "_blank", "noopener")
                          toast.info(`Opening ${system.name}`, {
                            description: `Launching ${system.name} in a new tab…`,
                          })
                        }}
                      >
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Open in source system
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}

          {signal.detailItems.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No items need your attention.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
