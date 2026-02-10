import { useState } from "react"
import type { ExceptionItem } from "@/data/types"
import { partners } from "@/data/partners"
import { EXCEPTION_SEVERITY_STYLES } from "@/lib/constants"
import SeverityBadge from "@/components/shared/SeverityBadge"
import DomainIcon from "@/components/shared/DomainIcon"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import SituationSummary from "./SituationSummary"
import OptionsPanel from "./OptionsPanel"
import EADecisionInput from "./EADecisionInput"
import { cn } from "@/lib/utils"
import { Clock, ChevronDown, ChevronUp } from "lucide-react"

interface ExceptionCardProps {
  exception: ExceptionItem
  onResolve?: (exceptionId: string, optionId: string, note: string) => void
}

export default function ExceptionCard({
  exception,
  onResolve,
}: ExceptionCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)
  const partner = partners.find((p) => p.id === exception.partnerId)
  const severityStyle = EXCEPTION_SEVERITY_STYLES[exception.severity]

  const handleResolve = (note: string) => {
    if (selectedOptionId) {
      onResolve?.(exception.id, selectedOptionId, note)
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 bg-card shadow-sm",
        severityStyle.border
      )}
    >
      {/* 1. Header — clickable to collapse/expand */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start justify-between border-b px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight">
            {exception.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {partner && (
              <PartnerAvatar partner={partner} size="sm" showInfo={false} />
            )}
            {partner && (
              <span className="text-xs text-muted-foreground">
                {partner.name}
              </span>
            )}
            <SeverityBadge severity={exception.severity} />
            <div className="flex items-center gap-1.5">
              {exception.domains.map((d) => (
                <DomainIcon key={d} domain={d} size={16} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {exception.timestamp}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Collapsible content */}
      {expanded && (
        <div className="space-y-5 px-5 py-4">
          {/* 2. Situation Summary */}
          <SituationSummary
            summary={exception.situationSummary}
            entityChips={exception.entityChips}
          />

          {/* 3. Options Panel */}
          <OptionsPanel
            options={exception.options}
            selectedOptionId={selectedOptionId}
            onSelect={setSelectedOptionId}
          />

          {/* 4. EA Decision Input */}
          <EADecisionInput
            hasSelection={selectedOptionId !== null}
            onResolve={handleResolve}
          />
        </div>
      )}
    </div>
  )
}
