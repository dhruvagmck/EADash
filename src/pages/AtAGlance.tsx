import { useState, useMemo } from "react"
import PageHeader from "@/components/layout/PageHeader"
import IntentBar, { type FocusMode } from "@/components/at-a-glance/IntentBar"
import PartnerSwimlane from "@/components/at-a-glance/PartnerSwimlane"
import PortfolioDetailPanel from "@/components/at-a-glance/PortfolioDetailPanel"
import { partners } from "@/data/partners"
import { swimlaneSummaries } from "@/data/partners"
import { useDashboardState } from "@/store/DashboardProvider"
import type { SignalBlockData, Severity, Domain } from "@/data/types"
import { loadSettings } from "@/lib/settings"
import { Clock } from "lucide-react"

// Map focus modes to the domains they cover
const FOCUS_DOMAIN_MAP: Record<FocusMode, Domain[] | null> = {
  all: null, // no filter
  "client-facing": ["client-facing", "email-triage"],
  "internal": ["internal-scheduling", "timesheets"],
  "travel-expenses": ["travel-expenses"],
  custom: null, // driven by customDomains state
}

// Check whether the current time falls outside the user's working hours
function isOutsideWorkingHours(): boolean {
  try {
    const settings = loadSettings()
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const [startH, startM] = settings.workingHours.start.split(":").map(Number)
    const [endH, endM] = settings.workingHours.end.split(":").map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    return currentMinutes < startMinutes || currentMinutes > endMinutes
  } catch {
    return false
  }
}

export default function AtAGlance() {
  const { signals: signalBlocks } = useDashboardState()
  const offHours = useMemo(() => isOutsideWorkingHours(), [])

  const [selectedSignal, setSelectedSignal] = useState<SignalBlockData | null>(
    null
  )
  const [panelOpen, setPanelOpen] = useState(false)
  const [focusMode, setFocusMode] = useState<FocusMode>("all")
  const [severityFilter, setSeverityFilter] = useState<Severity | null>(null)
  const [protectedWindow, setProtectedWindow] = useState(false)
  const [customDomains, setCustomDomains] = useState<Domain[]>([])

  // Resolve effective domain filter
  const effectiveDomains = useMemo(() => {
    if (focusMode === "custom") {
      return customDomains.length > 0 ? customDomains : null
    }
    return FOCUS_DOMAIN_MAP[focusMode]
  }, [focusMode, customDomains])

  // Filter signals by focus mode + severity + protected window
  const focusedSignals = useMemo(() => {
    let filtered = signalBlocks
    if (effectiveDomains) {
      filtered = filtered.filter((s) => effectiveDomains.includes(s.domain))
    }
    // Protected window: only show urgent items
    if (protectedWindow) {
      filtered = filtered.filter((s) => s.severity === "urgent")
    } else if (severityFilter) {
      const matchSeverities: Severity[] =
        severityFilter === "running" ? ["running", "clear"] : [severityFilter]
      filtered = filtered.filter((s) => matchSeverities.includes(s.severity))
    }
    return filtered
  }, [signalBlocks, effectiveDomains, severityFilter, protectedWindow])

  // Compute priority counts from domain-filtered signals (before severity filter)
  const domainFilteredSignals = effectiveDomains
    ? signalBlocks.filter((s) => effectiveDomains.includes(s.domain))
    : signalBlocks
  const urgentCount = domainFilteredSignals.filter(
    (s) => s.severity === "urgent"
  ).length
  const reviewCount = domainFilteredSignals.filter(
    (s) => s.severity === "review"
  ).length
  const runningCount = domainFilteredSignals.filter(
    (s) => s.severity === "running" || s.severity === "clear"
  ).length

  // Sort partners by attention demand (most urgent first)
  const sortedPartners = useMemo(() => {
    const severityWeight = { urgent: 4, review: 3, running: 1, clear: 0 }
    return [...partners].sort((a, b) => {
      const aSignals = focusedSignals.filter((s) => s.partnerId === a.id)
      const bSignals = focusedSignals.filter((s) => s.partnerId === b.id)
      const aScore = aSignals.reduce(
        (sum, s) => sum + (severityWeight[s.severity] || 0) * s.count,
        0
      )
      const bScore = bSignals.reduce(
        (sum, s) => sum + (severityWeight[s.severity] || 0) * s.count,
        0
      )
      return bScore - aScore
    })
  }, [focusedSignals])

  const handleSignalClick = (signal: SignalBlockData) => {
    setSelectedSignal(signal)
    setPanelOpen(true)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="At a Glance"
        subtitle="Where your attention needs to go across partners and domains"
      />

      {/* Off-hours banner */}
      {offHours && (
        <div className="mx-4 mt-2 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          <Clock className="h-4 w-4 shrink-0" />
          <span className="font-medium">You're outside working hours.</span>
          <span className="text-amber-700 dark:text-amber-400">
            Items below may have arrived while you were away. Adjust working hours in Settings.
          </span>
        </div>
      )}

      {/* Zone A: Intent Bar */}
      <IntentBar
        urgentCount={urgentCount}
        reviewCount={reviewCount}
        runningCount={runningCount}
        activeMode={focusMode}
        onModeChange={setFocusMode}
        activeSeverityFilter={severityFilter}
        onSeverityFilter={setSeverityFilter}
        protectedWindow={protectedWindow}
        onProtectedWindowChange={setProtectedWindow}
        customDomains={customDomains}
        onCustomDomainsChange={setCustomDomains}
      />

      {/* Zone B: Partner Swimlanes */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
        {sortedPartners.map((partner) => {
          const partnerSignals = focusedSignals.filter(
            (s) => s.partnerId === partner.id
          )
          const summary = swimlaneSummaries.find(
            (s) => s.partnerId === partner.id
          )

          if (!summary) return null

          // Skip partners with no visible signals if filter is active
          if (
            (severityFilter || focusMode !== "all" || protectedWindow) &&
            partnerSignals.length === 0
          ) {
            return null
          }

          return (
            <PartnerSwimlane
              key={partner.id}
              partner={partner}
              signals={partnerSignals}
              summary={summary}
              onSignalClick={handleSignalClick}
              onPartnerClick={() => {
                if (partnerSignals.length > 0) {
                  handleSignalClick(partnerSignals[0])
                }
              }}
            />
          )
        })}

        {/* Empty state when all items are filtered out */}
        {sortedPartners.every(
          (p) =>
            focusedSignals.filter((s) => s.partnerId === p.id).length === 0
        ) && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {protectedWindow
                ? "No urgent items during protected window."
                : "No items match this filter."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              All automations running within authority.
            </p>
          </div>
        )}
      </div>

      {/* Zone C: Detail Panel */}
      <PortfolioDetailPanel
        signal={selectedSignal}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  )
}
