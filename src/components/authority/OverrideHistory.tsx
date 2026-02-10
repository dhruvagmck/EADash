import type { OverrideEntry } from "@/data/types"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface OverrideHistoryProps {
  entries: OverrideEntry[]
}

const resultStyles = {
  approved: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  modified: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
}

export default function OverrideHistory({ entries }: OverrideHistoryProps) {
  const [open, setOpen] = useState(false)

  if (entries.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No override history</p>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            open && "rotate-180"
          )}
        />
        {entries.length} override{entries.length !== 1 ? "s" : ""}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1.5">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className="w-12 shrink-0 font-medium">{entry.date}</span>
            <span className="flex-1 truncate">{entry.action}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
                resultStyles[entry.result]
              )}
            >
              {entry.result}
            </span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
