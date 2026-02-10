import { Button } from "@/components/ui/button"
import { Check, Pencil, X, ArrowUpRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SupervisionActionBarProps {
  onApprove?: () => void
  onModify?: () => void
  onReject?: () => void
  onEscalate?: () => void
}

export default function SupervisionActionBar({
  onApprove,
  onModify,
  onReject,
  onEscalate,
}: SupervisionActionBarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t bg-card px-4 py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onApprove}
              size="sm"
              className="min-w-0 flex-[2_1_auto] gap-1.5 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 shrink-0" />
              <span className="truncate">Approve</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>
          </TooltipContent>
        </Tooltip>

        <Button
          onClick={onModify}
          variant="outline"
          size="sm"
          className="min-w-0 flex-[1_1_auto] gap-1.5"
        >
          <Pencil className="h-4 w-4 shrink-0" />
          <span className="truncate">Modify</span>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onReject}
              variant="outline"
              size="sm"
              className="min-w-0 flex-[1_1_auto] gap-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="h-4 w-4 shrink-0" />
              <span className="truncate">Reject</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              R
            </kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onEscalate}
              variant="ghost"
              size="sm"
              className="min-w-0 gap-1.5 text-muted-foreground"
            >
              <ArrowUpRight className="h-4 w-4 shrink-0" />
              <span className="truncate">Escalate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              E
            </kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
