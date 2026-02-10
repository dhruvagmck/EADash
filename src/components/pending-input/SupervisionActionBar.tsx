import { Button } from "@/components/ui/button"
import { Check, X, ArrowUpRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SupervisionActionBarProps {
  onApprove?: () => void
  onReject?: () => void
  onEscalate?: () => void
}

export default function SupervisionActionBar({
  onApprove,
  onReject,
  onEscalate,
}: SupervisionActionBarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex shrink-0 items-center gap-2 border-t bg-card px-4 py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onApprove}
              size="sm"
              className="flex-[2] gap-1.5 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 shrink-0" />
              Approve
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onReject}
              variant="outline"
              size="sm"
              className="flex-[1] gap-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="h-4 w-4 shrink-0" />
              Reject
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
              className="gap-1.5 text-muted-foreground"
            >
              <ArrowUpRight className="h-4 w-4 shrink-0" />
              Escalate
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
