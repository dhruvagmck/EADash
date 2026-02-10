import { useState, useMemo } from "react"
import PageHeader from "@/components/layout/PageHeader"
import PartnerFilterBar from "@/components/shared/PartnerFilterBar"
import AuthorityProfile from "@/components/authority/AuthorityProfile"
import { partners } from "@/data/partners"
import { authorityRules } from "@/data/authority"

export default function AuthorityEditor() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    partners[0].id
  )

  // Count rules per partner for the filter bar
  const partnerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const rule of authorityRules) {
      counts[rule.partnerId] = (counts[rule.partnerId] || 0) + 1
    }
    return counts
  }, [])

  // If no partner selected (shouldn't happen since showAll=false), default to first
  const effectivePartnerId = selectedPartnerId ?? partners[0].id

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Authority"
        subtitle="CAN / SHOULD / CANNOT rules per partner and domain"
      />

      {/* Partner filter bar — no "All" since rules are per-partner */}
      <PartnerFilterBar
        partners={partners}
        selectedPartnerId={effectivePartnerId}
        onSelectPartner={(id) => setSelectedPartnerId(id ?? partners[0].id)}
        partnerCounts={partnerCounts}
        totalCount={authorityRules.length}
        showAll={false}
      />

      <div className="min-h-0 flex-1 overflow-hidden p-6">
        <AuthorityProfile
          partnerId={effectivePartnerId}
          rules={authorityRules}
        />
      </div>
    </div>
  )
}
