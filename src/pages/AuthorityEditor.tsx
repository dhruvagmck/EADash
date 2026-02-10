import { useState } from "react"
import PageHeader from "@/components/layout/PageHeader"
import PartnerSelector from "@/components/authority/PartnerSelector"
import AuthorityProfile from "@/components/authority/AuthorityProfile"
import { partners } from "@/data/partners"
import { authorityRules } from "@/data/authority"

export default function AuthorityEditor() {
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0].id)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Authority"
        subtitle="Define CAN / SHOULD / CANNOT rules per Partner per domain"
      />

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden p-6">
        <PartnerSelector
          partners={partners}
          rules={authorityRules}
          selectedId={selectedPartnerId}
          onSelect={setSelectedPartnerId}
        />
        <AuthorityProfile
          partnerId={selectedPartnerId}
          rules={authorityRules}
        />
      </div>
    </div>
  )
}
