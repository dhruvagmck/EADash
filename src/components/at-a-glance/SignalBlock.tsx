import type { SignalBlockData } from "@/data/types"
import { DOMAIN_CONFIG, SEVERITY_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SignalBlockProps {
  signal: SignalBlockData
  onClick?: () => void
}

export default function SignalBlock({ signal, onClick }: SignalBlockProps) {
  const domainConfig = DOMAIN_CONFIG[signal.domain]
  const severityStyle = SEVERITY_STYLES[signal.severity]
  const Icon = domainConfig.icon

  // Top 3 items for tooltip
  const tooltipItems = signal.detailItems.slice(0, 3)

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "group relative flex h-20 w-[140px] shrink-0 flex-col justify-between rounded-lg border-l-[3px] bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md",
              severityStyle.border
            )}
          >
            <div className="flex items-center justify-between">
              <Icon
                className="h-4 w-4"
                style={{ color: domainConfig.color }}
              />
              {signal.count > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    severityStyle.bg,
                    severityStyle.text
                  )}
                >
                  {signal.count}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground">
                {domainConfig.label}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {signal.summary}
              </p>
            </div>
          </button>
        </TooltipTrigger>
        {tooltipItems.length > 0 && (
          <TooltipContent
            side="bottom"
            className="max-w-xs space-y-1 p-3"
          >
            <p className="mb-1.5 text-xs font-semibold">
              {domainConfig.label} — {signal.count} item
              {signal.count !== 1 ? "s" : ""}
            </p>
            {tooltipItems.map((item, i) => (
              <p key={i} className="text-xs leading-relaxed">
                {item}
              </p>
            ))}
            {signal.detailItems.length > 3 && (
              <p className="text-[11px] text-muted-foreground">
                +{signal.detailItems.length - 3} more...
              </p>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
