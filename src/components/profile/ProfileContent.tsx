import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type {
  PartnerProfile,
  PartnerPreference,
  TravelPreferences,
  SchedulingPreferences,
  CommunicationPreferences,
  ExpensePreferences,
  Partner,
  AuthorityRule,
  DeskNote,
  VIPContact,
  RecurringCommitment,
  AmbientInsight,
} from "@/data/types"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import AuthoritySummaryBar from "@/components/authority/AuthoritySummaryBar"
import StructuredPreferenceSection from "./StructuredPreferenceSection"
import TimesheetTracker from "./TimesheetTracker"
import VIPContactList from "./VIPContactList"
import CommitmentList from "./CommitmentList"
import DeskNoteLog from "./DeskNoteLog"
import CoverageHandoff from "./CoverageHandoff"
import AmbientInsightsPanel from "./AmbientInsightsPanel"
import LinkedRuleBadge from "./LinkedRuleBadge"
import {
  Heart,
  Users,
  CalendarClock,
  StickyNote,
  Shield,
  ArrowRightLeft,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react"

interface ProfileContentProps {
  partner: Partner
  profile: PartnerProfile
  rules: AuthorityRule[]
  onUpdatePreference: (preference: PartnerPreference) => void
  onAddDeskNote: (note: DeskNote) => void
  onTogglePinNote: (noteId: string) => void
  onUpdateHandoff: (text: string) => void
  onUpdateEscalation: (text: string) => void
  onAddVIPContact: (contact: VIPContact) => void
  onRemoveVIPContact: (name: string) => void
  onConfirmVIPContact?: (name: string) => void
  onDismissVIPContact?: (name: string) => void
  onAddCommitment: (commitment: RecurringCommitment) => void
  onRemoveCommitment: (title: string) => void
  onConfirmCommitment?: (title: string) => void
  onDismissCommitment?: (title: string) => void
  onUpdateStructured: (patch: Partial<{
    travel: Partial<TravelPreferences>
    scheduling: Partial<SchedulingPreferences>
    communication: Partial<CommunicationPreferences>
    expenses: Partial<ExpensePreferences>
  }>) => void
  ambientInsights?: AmbientInsight[]
  onAcceptInsight?: (id: string) => void
  onDismissInsight?: (id: string) => void
}

export default function ProfileContent({
  partner,
  profile,
  rules,
  onUpdatePreference,
  onAddDeskNote,
  onTogglePinNote,
  onUpdateHandoff,
  onUpdateEscalation,
  onAddVIPContact,
  onRemoveVIPContact,
  onConfirmVIPContact,
  onDismissVIPContact,
  onAddCommitment,
  onRemoveCommitment,
  onConfirmCommitment,
  onDismissCommitment,
  onUpdateStructured,
  ambientInsights = [],
  onAcceptInsight,
  onDismissInsight,
}: ProfileContentProps) {
  const navigate = useNavigate()
  const partnerRules = rules.filter((r) => r.partnerId === partner.id)

  // Find preferences that have no linked rules
  const unlinkedPrefs = profile.preferences.filter(
    (p) => p.linkedRuleIds.length === 0
  )

  // Count suggested items for badges
  const suggestedContacts = profile.vipContacts.filter(
    (c) => c.status === "suggested"
  ).length
  const suggestedCommitments = profile.recurringCommitments.filter(
    (c) => c.status === "suggested"
  ).length
  const activeInsightCount = ambientInsights.filter(
    (i) => i.status === "active"
  ).length

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-4">
      {/* Partner Header */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4">
          <PartnerAvatar partner={partner} size="lg" showInfo />
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>
            Last updated:{" "}
            <span className="font-medium text-foreground">
              {profile.lastUpdated}
            </span>
          </p>
          <p>
            By:{" "}
            <span className="font-medium text-foreground">
              {profile.lastUpdatedBy}
            </span>
          </p>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs
        defaultValue="preferences"
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList className="w-full shrink-0 flex-wrap justify-start">
          <TabsTrigger value="preferences" className="gap-1.5 text-xs">
            <Heart className="h-3.5 w-3.5" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="ai-observations" className="gap-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            AI Observations
            {activeInsightCount > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
                {activeInsightCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="timesheets" className="gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5" />
            Utilization
          </TabsTrigger>
          <TabsTrigger value="people" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Key People
            {suggestedContacts > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
                {suggestedContacts} new
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="commitments" className="gap-1.5 text-xs">
            <CalendarClock className="h-3.5 w-3.5" />
            Commitments
            {suggestedCommitments > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
                {suggestedCommitments} new
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5 text-xs">
            <StickyNote className="h-3.5 w-3.5" />
            Desk Notes
            <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {profile.deskNotes.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="authority" className="gap-1.5 text-xs">
            <Shield className="h-3.5 w-3.5" />
            Authority Summary
          </TabsTrigger>
          <TabsTrigger value="handoff" className="gap-1.5 text-xs">
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Handoff
          </TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent
          value="preferences"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="pr-4">
            <StructuredPreferenceSection
              structured={profile.structuredPreferences}
              freeTextPreferences={profile.preferences}
              onAddPreference={onUpdatePreference}
              onUpdateStructured={onUpdateStructured}
              ambientInsights={ambientInsights}
              onAcceptInsight={onAcceptInsight}
              onDismissInsight={onDismissInsight}
            />
          </div>
        </TabsContent>

        {/* AI Observations Tab */}
        <TabsContent
          value="ai-observations"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="pr-4">
            <AmbientInsightsPanel
              insights={ambientInsights}
              onAccept={onAcceptInsight}
              onDismiss={onDismissInsight}
            />
          </div>
        </TabsContent>

        {/* Timesheets Tab */}
        <TabsContent
          value="timesheets"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="pr-4">
            <TimesheetTracker data={profile.timesheetData} />
          </div>
        </TabsContent>

        {/* Key People Tab */}
        <TabsContent
          value="people"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="pr-4">
            <VIPContactList
              contacts={profile.vipContacts}
              onAdd={onAddVIPContact}
              onRemove={onRemoveVIPContact}
              onConfirm={onConfirmVIPContact}
              onDismiss={onDismissVIPContact}
            />
          </div>
        </TabsContent>

        {/* Commitments Tab */}
        <TabsContent
          value="commitments"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="pr-4">
            <CommitmentList
              commitments={profile.recurringCommitments}
              onAdd={onAddCommitment}
              onRemove={onRemoveCommitment}
              onConfirm={onConfirmCommitment}
              onDismiss={onDismissCommitment}
            />
          </div>
        </TabsContent>

        {/* Desk Notes Tab */}
        <TabsContent
          value="notes"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="pr-4">
            <DeskNoteLog
              notes={profile.deskNotes}
              onAdd={onAddDeskNote}
              onTogglePin={onTogglePinNote}
            />
          </div>
        </TabsContent>

        {/* Authority Summary Tab */}
        <TabsContent
          value="authority"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-4 pr-4">
            <AuthoritySummaryBar
              rules={partnerRules}
              lastReviewed="3 days ago"
              lastReviewedDays={3}
            />

            {/* Linked preferences overview */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">
                Preferences with Linked Rules
              </h3>
              <div className="space-y-2">
                {profile.preferences
                  .filter((p) => p.linkedRuleIds.length > 0)
                  .map((pref) => (
                    <div
                      key={pref.id}
                      className="flex items-start gap-2 rounded-md border bg-muted/30 p-2"
                    >
                      <p className="min-w-0 flex-1 text-xs">{pref.text}</p>
                      <div className="flex shrink-0 flex-wrap gap-1">
                        {pref.linkedRuleIds.map((ruleId) => (
                          <LinkedRuleBadge key={ruleId} ruleId={ruleId} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Gap indicator */}
            {unlinkedPrefs.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <h3 className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Preferences Without Automation Rules ({unlinkedPrefs.length})
                </h3>
                <p className="mb-3 text-xs text-amber-700 dark:text-amber-400">
                  These preferences are documented but don't have corresponding
                  authority rules. Consider creating rules to automate them.
                </p>
                <div className="space-y-1.5">
                  {unlinkedPrefs.map((pref) => (
                    <div key={pref.id} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <p className="text-xs">{pref.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link to Authority */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => navigate("/authority")}
            >
              <ExternalLink className="h-4 w-4" />
              Open Full Authority Editor
            </Button>
          </div>
        </TabsContent>

        {/* Handoff Tab */}
        <TabsContent
          value="handoff"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="pr-4">
            <CoverageHandoff
              handoffText={profile.coverageHandoff}
              escalationNotes={profile.escalationNotes}
              onUpdateHandoff={onUpdateHandoff}
              onUpdateEscalation={onUpdateEscalation}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
