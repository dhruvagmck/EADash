import { useState } from "react"
import type { DecisionItem } from "@/data/types"
import { partners } from "@/data/partners"
import { EXCEPTION_SEVERITY_STYLES } from "@/lib/constants"
import SeverityBadge from "@/components/shared/SeverityBadge"
import DomainIcon from "@/components/shared/DomainIcon"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import SituationSummary from "./SituationSummary"
import OptionsPanel from "./OptionsPanel"
import EADecisionInput from "./EADecisionInput"
import PredictionBadge from "./PredictionBadge"
import PredictionBasis from "./PredictionBasis"
import { cn } from "@/lib/utils"
import { Clock, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react"

interface ExceptionCardProps {
  exception: DecisionItem
  onResolve?: (exceptionId: string, optionId: string, note: string) => void
  onDismissPrediction?: (exceptionId: string) => void
  onPrestagePrediction?: (exceptionId: string) => void
}

export default function ExceptionCard({
  exception,
  onResolve,
  onDismissPrediction,
  onPrestagePrediction,
}: ExceptionCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)
  const partner = partners.find((p) => p.id === exception.partnerId)
  const severityStyle = EXCEPTION_SEVERITY_STYLES[exception.severity]
  const isPrediction = !!exception.prediction
  const isPreStaged = exception.prediction?.preStaged

  const handleResolve = (note: string) => {
    if (selectedOptionId) {
      onResolve?.(exception.id, selectedOptionId, note)
    }
  }

  const handlePrestage = () => {
    if (selectedOptionId) {
      onPrestagePrediction?.(exception.id)
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-card shadow-sm",
        isPrediction
          ? "border-l-4 border-dashed border-l-indigo-400 ring-1 ring-indigo-100 dark:border-l-indigo-500 dark:ring-indigo-900/50"
          : cn("border-l-4", severityStyle.border)
      )}
    >
      {/* Pre-staged confirmation banner */}
      {isPreStaged && (
        <div className="flex items-center gap-2 rounded-t-xl bg-green-50 px-5 py-2 dark:bg-green-950/50">
          <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          <span className="text-xs font-medium text-green-700 dark:text-green-300">
            Response pre-staged — will activate automatically if this event occurs
          </span>
        </div>
      )}

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
            {isPrediction ? (
              <PredictionBadge probability={exception.prediction!.probability} size="sm" />
            ) : (
              <SeverityBadge severity={exception.severity} />
            )}
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
          {/* Prediction basis (only for predicted exceptions) */}
          {isPrediction && (
            <PredictionBasis prediction={exception.prediction!} />
          )}

          {/* 2. Situation Summary */}
          <SituationSummary
            summary={exception.situationSummary}
            entityChips={exception.entityChips}
          />

          {/* 3. Options Panel */}
          {!isPreStaged && (
            <OptionsPanel
              options={exception.options}
              selectedOptionId={selectedOptionId}
              onSelect={setSelectedOptionId}
            />
          )}

          {/* 4. EA Decision Input */}
          {isPrediction && !isPreStaged ? (
            <EADecisionInput
              hasSelection={selectedOptionId !== null}
              onResolve={handleResolve}
              isPrediction
              onPrestage={handlePrestage}
              onDismissPrediction={() => onDismissPrediction?.(exception.id)}
            />
          ) : !isPreStaged ? (
            <EADecisionInput
              hasSelection={selectedOptionId !== null}
              onResolve={handleResolve}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
