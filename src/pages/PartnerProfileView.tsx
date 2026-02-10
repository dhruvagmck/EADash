import { useState, useMemo } from "react"
import PageHeader from "@/components/layout/PageHeader"
import PartnerFilterBar from "@/components/shared/PartnerFilterBar"
import ProfileContent from "@/components/profile/ProfileContent"
import { partners } from "@/data/partners"
import { authorityRules } from "@/data/authority"
import {
  useDashboardState,
  useDashboardActions,
} from "@/store/DashboardContext"

export default function PartnerProfileView() {
  const [selectedId, setSelectedId] = useState<string | null>(
    partners[0]?.id || null
  )
  const { partnerProfiles } = useDashboardState()
  const {
    updatePreference,
    addDeskNote,
    togglePinNote,
    updateCoverageHandoff,
    updateEscalationNotes,
    addVIPContact,
    removeVIPContact,
    addCommitment,
    removeCommitment,
  } = useDashboardActions()

  // Count preferences + notes per partner for the filter bar badges
  const partnerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const profile of partnerProfiles) {
      counts[profile.partnerId] =
        profile.preferences.length + profile.deskNotes.length
    }
    return counts
  }, [partnerProfiles])

  const effectiveId = selectedId ?? partners[0]?.id
  const selectedPartner = partners.find((p) => p.id === effectiveId)
  const selectedProfile = partnerProfiles.find(
    (p) => p.partnerId === effectiveId
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Partner Profiles"
        subtitle="Desk notes, preferences, and handoff context for each partner"
      />

      {/* Partner filter bar — no "All" since profiles are per-partner */}
      <PartnerFilterBar
        partners={partners}
        selectedPartnerId={effectiveId}
        onSelectPartner={(id) => setSelectedId(id ?? partners[0]?.id)}
        partnerCounts={partnerCounts}
        totalCount={partnerProfiles.reduce(
          (sum, p) => sum + p.preferences.length + p.deskNotes.length,
          0
        )}
        showAll={false}
      />

      <div className="flex min-h-0 flex-1 px-4 py-2">
        {selectedPartner && selectedProfile ? (
          <ProfileContent
            partner={selectedPartner}
            profile={selectedProfile}
            rules={authorityRules}
            onUpdatePreference={(pref) =>
              updatePreference(effectiveId, pref)
            }
            onAddDeskNote={(note) => addDeskNote(effectiveId, note)}
            onTogglePinNote={(noteId) => togglePinNote(effectiveId, noteId)}
            onUpdateHandoff={(text) =>
              updateCoverageHandoff(effectiveId, text)
            }
            onUpdateEscalation={(text) =>
              updateEscalationNotes(effectiveId, text)
            }
            onAddVIPContact={(contact) =>
              addVIPContact(effectiveId, contact)
            }
            onRemoveVIPContact={(name) =>
              removeVIPContact(effectiveId, name)
            }
            onAddCommitment={(c) => addCommitment(effectiveId, c)}
            onRemoveCommitment={(title) =>
              removeCommitment(effectiveId, title)
            }
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Select a partner to view their profile.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
