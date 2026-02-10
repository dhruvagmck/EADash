import { useState } from "react"
import type { SupervisionItem } from "@/data/types"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContextCardProps {
  item: SupervisionItem
}

const CONTEXT_TABS = ["Context", "History"] as const

export default function ContextCard({ item }: ContextCardProps) {
  const [expanded, setExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<(typeof CONTEXT_TABS)[number]>(
    "Context"
  )

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
        <div className="border-t px-4 pb-4 pt-2">
          {/* Tabs */}
          <div className="mb-3 flex gap-1 border-b">
            {CONTEXT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === tab
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "Context" && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.context}
            </p>
          )}
          {activeTab === "History" && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                This rule has been triggered{" "}
                <span className="font-medium text-foreground">
                  {Math.floor(Math.random() * 20) + 5}
                </span>{" "}
                times in the last 30 days for this partner.
              </p>
              <p>
                Last 3 resolutions: approved, approved, modified.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
