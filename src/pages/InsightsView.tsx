import { useState, useMemo } from "react"
import PageHeader from "@/components/layout/PageHeader"
import AdjustmentCard from "@/components/insights/AdjustmentCard"
import GuidanceCard from "@/components/insights/GuidanceCard"
import PatternReports from "@/components/insights/PatternReports"
import PartnerFilterBar from "@/components/shared/PartnerFilterBar"
import { Separator } from "@/components/ui/separator"
import { useDashboardState, useDashboardActions } from "@/store/DashboardContext"
import { partners } from "@/data/partners"
import { patternReport } from "@/data/insights"
import { toast } from "sonner"
import { Shield, Sparkles, BarChart3 } from "lucide-react"

export default function InsightsView() {
  const { adjustments, guidance } = useDashboardState()
  const { dismissAdjustment, dismissGuidance } = useDashboardActions()
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null)

  // Partner counts (adjustments + guidance combined)
  const partnerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const adj of adjustments) {
      counts[adj.partnerId] = (counts[adj.partnerId] || 0) + 1
    }
    for (const g of guidance) {
      counts[g.partnerId] = (counts[g.partnerId] || 0) + 1
    }
    return counts
  }, [adjustments, guidance])

  const filteredAdjustments = useMemo(
    () =>
      selectedPartnerId
        ? adjustments.filter((a) => a.partnerId === selectedPartnerId)
        : adjustments,
    [adjustments, selectedPartnerId]
  )

  const filteredGuidance = useMemo(
    () =>
      selectedPartnerId
        ? guidance.filter((g) => g.partnerId === selectedPartnerId)
        : guidance,
    [guidance, selectedPartnerId]
  )

  const handleDismissAdjustment = (id: string) => {
    const adj = adjustments.find((a) => a.id === id)
    dismissAdjustment(id)
    toast.success("Adjustment applied", {
      description: adj?.title ?? "Authority adjustment processed.",
    })
  }

  const handleDismissGuidance = (id: string) => {
    const g = guidance.find((gi) => gi.id === id)
    dismissGuidance(id)
    toast.info("Guidance dismissed", {
      description: g?.title ?? "Guidance item removed.",
    })
  }

  const handleGuidanceAction = (id: string, actionLabel: string) => {
    const g = guidance.find((gi) => gi.id === id)
    dismissGuidance(id)
    toast.success(`${actionLabel}`, {
      description: g?.title ?? "Action taken.",
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="AI Suggestions"
        subtitle="Patterns, suggestions, and performance trends"
      />

      {/* Partner filter bar */}
      <PartnerFilterBar
        partners={partners}
        selectedPartnerId={selectedPartnerId}
        onSelectPartner={setSelectedPartnerId}
        partnerCounts={partnerCounts}
        totalCount={adjustments.length + guidance.length}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8 p-6">
          {/* Section A: Suggested Authority Adjustments */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              <h2 className="text-base font-semibold">
                Suggested Adjustments
              </h2>
              {filteredAdjustments.length > 0 && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {filteredAdjustments.length}
                </span>
              )}
            </div>
            {filteredAdjustments.length > 0 ? (
              <div className="space-y-3">
                {filteredAdjustments.map((adj) => (
                  <AdjustmentCard
                    key={adj.id}
                    adjustment={adj}
                    onDismiss={handleDismissAdjustment}
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No pending suggestions.
              </p>
            )}
          </section>

          <Separator />

          {/* Section B: Proactive Guidance */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-semibold">Proactive Guidance</h2>
              {filteredGuidance.length > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  {filteredGuidance.length}
                </span>
              )}
            </div>
            {filteredGuidance.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {filteredGuidance.map((g) => (
                  <GuidanceCard
                    key={g.id}
                    guidance={g}
                    onDismiss={handleDismissGuidance}
                    onAction={handleGuidanceAction}
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No proactive suggestions at this time.
              </p>
            )}
          </section>

          <Separator />

          {/* Section C: Pattern Reports */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-500" />
              <h2 className="text-base font-semibold">
                Pattern Reports
              </h2>
            </div>
            <PatternReports report={patternReport} />
          </section>
        </div>
      </div>
    </div>
  )
}
