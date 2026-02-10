import ConditionChip from "@/components/shared/ConditionChip"

interface SituationSummaryProps {
  summary: string
  entityChips: string[]
}

export default function SituationSummary({
  summary,
  entityChips,
}: SituationSummaryProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">{summary}</p>
      {entityChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entityChips.map((chip) => (
            <ConditionChip key={chip} label={chip} />
          ))}
        </div>
      )}
    </div>
  )
}
