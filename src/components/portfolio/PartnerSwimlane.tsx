import type { Partner, SignalBlockData, SwimlaneSummaryData } from "@/data/types"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import SignalBlock from "./SignalBlock"
import SwimlaneSummary from "./SwimlaneSummary"
import { Separator } from "@/components/ui/separator"

interface PartnerSwimlaneProps {
  partner: Partner
  signals: SignalBlockData[]
  summary: SwimlaneSummaryData
  onSignalClick?: (signal: SignalBlockData) => void
  onPartnerClick?: () => void
}

export default function PartnerSwimlane({
  partner,
  signals,
  summary,
  onSignalClick,
  onPartnerClick,
}: PartnerSwimlaneProps) {
  return (
    <div className="flex items-center border-b py-3 last:border-b-0">
      {/* Partner Identity */}
      <button
        onClick={onPartnerClick}
        className="w-[160px] shrink-0 px-2 text-left transition-opacity hover:opacity-80"
      >
        <PartnerAvatar partner={partner} size="md" showInfo />
        {partner.coverageStatus === "coverage" && (
          <span className="mt-1 inline-flex text-[10px] text-amber-600 dark:text-amber-400">
            Coverage: {partner.coverageName}
          </span>
        )}
      </button>

      <Separator orientation="vertical" className="mx-2 h-14" />

      {/* Signal Blocks */}
      <div className="flex flex-1 items-center gap-2 overflow-x-auto px-2">
        {signals.map((signal) => (
          <SignalBlock
            key={signal.id}
            signal={signal}
            onClick={() => onSignalClick?.(signal)}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="mx-2 h-14" />

      {/* Summary */}
      <SwimlaneSummary summary={summary} />
    </div>
  )
}
