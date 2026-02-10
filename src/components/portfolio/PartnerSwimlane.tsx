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
    <div className="flex items-center border-b py-4 last:border-b-0">
      {/* Partner Identity */}
      <button
        onClick={onPartnerClick}
        className="w-[180px] shrink-0 px-2 text-left transition-opacity hover:opacity-80"
      >
        <PartnerAvatar partner={partner} size="lg" showInfo />
        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px]">
          {partner.coverageStatus === "active" && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-950 dark:text-green-400">
              You
            </span>
          )}
          {partner.coverageStatus === "coverage" && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              Coverage: {partner.coverageName}
            </span>
          )}
        </span>
      </button>

      <Separator orientation="vertical" className="mx-2 h-16" />

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

      <Separator orientation="vertical" className="mx-2 h-16" />

      {/* Summary */}
      <SwimlaneSummary summary={summary} />
    </div>
  )
}
