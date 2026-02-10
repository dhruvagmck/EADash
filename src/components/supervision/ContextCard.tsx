import { useState } from "react"
import type { SupervisionItem } from "@/data/types"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"

interface ContextCardProps {
  item: SupervisionItem
}

export default function ContextCard({ item }: ContextCardProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="rounded-lg border">
      {/* Header — collapsible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Context
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.context}
          </p>
        </div>
      )}
    </div>
  )
}
