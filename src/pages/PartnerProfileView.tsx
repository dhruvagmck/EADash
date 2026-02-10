import { useState } from "react"
import PageHeader from "@/components/layout/PageHeader"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import ProfileContent from "@/components/profile/ProfileContent"
import { partners } from "@/data/partners"
import { authorityRules } from "@/data/authority"
import {
  useDashboardState,
  useDashboardActions,
} from "@/store/DashboardContext"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

export default function PartnerProfileView() {
  const [selectedId, setSelectedId] = useState(partners[0]?.id || "")
  const [search, setSearch] = useState("")
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

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedPartner = partners.find((p) => p.id === selectedId)
  const selectedProfile = partnerProfiles.find(
    (p) => p.partnerId === selectedId
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Partner Profiles"
        subtitle="Desk notes, preferences, and handoff context — the permanent knowledge base for each partner."
      />

      <div className="flex min-h-0 flex-1 gap-0 px-4 py-2">
        {/* Left Sidebar: Partner Selector */}
        <div className="flex w-[280px] shrink-0 flex-col border-r pr-4">
          {/* Search */}
          <div className="relative mb-3 shrink-0">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          <p className="mb-3 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Partners
          </p>

          {/* Partner list */}
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
            {filteredPartners.map((partner) => {
              const profile = partnerProfiles.find(
                (p) => p.partnerId === partner.id
              )
              const isSelected = partner.id === selectedId
              const prefCount = profile?.preferences.length ?? 0
              const noteCount = profile?.deskNotes.length ?? 0

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedId(partner.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
                    isSelected
                      ? "border-border bg-muted shadow-sm"
                      : "border-transparent hover:bg-muted"
                  )}
                >
                  <PartnerAvatar partner={partner} showInfo />
                  <div className="ml-2 shrink-0 text-right">
                    <span className="block text-xs text-muted-foreground">
                      {prefCount} prefs
                    </span>
                    <span className="block text-[10px] text-muted-foreground/70">
                      {noteCount} notes
                    </span>
                  </div>
                </button>
              )
            })}

            {filteredPartners.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No partners match your search.
              </p>
            )}
          </div>
        </div>

        {/* Right Content: Profile */}
        <div className="flex min-h-0 min-w-0 flex-1 pl-4">
          {selectedPartner && selectedProfile ? (
            <ProfileContent
              partner={selectedPartner}
              profile={selectedProfile}
              rules={authorityRules}
              onUpdatePreference={(pref) =>
                updatePreference(selectedId, pref)
              }
              onAddDeskNote={(note) => addDeskNote(selectedId, note)}
              onTogglePinNote={(noteId) => togglePinNote(selectedId, noteId)}
              onUpdateHandoff={(text) =>
                updateCoverageHandoff(selectedId, text)
              }
              onUpdateEscalation={(text) =>
                updateEscalationNotes(selectedId, text)
              }
              onAddVIPContact={(contact) =>
                addVIPContact(selectedId, contact)
              }
              onRemoveVIPContact={(name) =>
                removeVIPContact(selectedId, name)
              }
              onAddCommitment={(c) => addCommitment(selectedId, c)}
              onRemoveCommitment={(title) =>
                removeCommitment(selectedId, title)
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
    </div>
  )
}
