import type { SupervisionItem } from "@/data/types"
import { partners } from "@/data/partners"
import DomainIcon from "@/components/shared/DomainIcon"
import TimeIndicator from "@/components/shared/TimeIndicator"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import ProposedActionPreview from "./ProposedActionPreview"
import ExplainabilityBlock from "./ExplainabilityBlock"
import ContextCard from "./ContextCard"
import SupervisionActionBar from "./SupervisionActionBar"

interface SupervisionDetailPanelProps {
  item: SupervisionItem | null
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onEscalate?: (id: string) => void
}

export default function SupervisionDetailPanel({
  item,
  onApprove,
  onReject,
  onEscalate,
}: SupervisionDetailPanelProps) {
  if (!item) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
        Select an item to view details
      </div>
    )
  }

  const partner = partners.find((p) => p.id === item.partnerId)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="shrink-0 border-b px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {partner && <PartnerAvatar partner={partner} size="sm" />}
          <DomainIcon domain={item.domain} size={18} />
          <TimeIndicator timeAgo={item.timeAgo} minutesAgo={item.minutesAgo} />
        </div>
        <h2 className="mt-2 text-base font-semibold leading-snug">{item.title}</h2>
      </div>

      {/* Scrollable detail content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 p-5">
          <ProposedActionPreview item={item} />
          <ExplainabilityBlock item={item} />
          <ContextCard item={item} />
        </div>
      </div>

      {/* Action bar — sticky at bottom */}
      <SupervisionActionBar
        onApprove={() => onApprove?.(item.id)}
        onReject={() => onReject?.(item.id)}
        onEscalate={() => onEscalate?.(item.id)}
      />
    </div>
  )
}
