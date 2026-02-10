import type { LucideIcon } from "lucide-react"

export type Domain =
  | "client-facing"
  | "internal-scheduling"
  | "travel-expenses"
  | "timesheets"
  | "email-triage"

export type Severity = "urgent" | "review" | "running" | "clear"
export type AuthorityLevel = "CAN" | "SHOULD" | "CANNOT"
export type ConfidenceLevel = "Recommended" | "Viable" | "Risky"
export type ExceptionSeverity = "P1" | "P2" | "P3"

export interface Partner {
  id: string
  name: string
  initials: string
  role: string
  location: string
  coverageStatus: "active" | "coverage" | "no-coverage"
  coverageName?: string
  colorAccent: string
}

export interface SignalBlockData {
  id: string
  partnerId: string
  domain: Domain
  count: number
  severity: Severity
  summary: string
  detailItems: string[]
}

export interface SwimlaneSummaryData {
  partnerId: string
  autoCount: number
  heldCount: number
  exceptionCount: number
}

export interface SupervisionItem {
  id: string
  partnerId: string
  domain: Domain
  title: string
  timeAgo: string
  minutesAgo: number
  authorityTag: string
  proposedAction: {
    type: "email_draft" | "booking" | "scheduling" | "expense"
    preview: string
    subject?: string
    to?: string
    from?: string
  }
  reasoning: string
  preferences: string[]
  context: string
  ruleId: string
}

export interface ResolutionOption {
  id: string
  title: string
  description: string
  tradeoffs: string
  downstreamEffects: string
  confidence: ConfidenceLevel
}

export interface ExceptionItem {
  id: string
  partnerId: string
  title: string
  severity: ExceptionSeverity
  timestamp: string
  domains: Domain[]
  situationSummary: string
  entityChips: string[]
  options: ResolutionOption[]
}

export interface OverrideEntry {
  date: string
  action: string
  result: "approved" | "modified" | "rejected"
}

export interface AuthorityRule {
  id: string
  partnerId: string
  domain: Domain
  level: AuthorityLevel
  actionDescription: string
  conditions: string[]
  escalationBehavior: string
  lastTriggered: string
  triggerCount30d: number
  overrideHistory: OverrideEntry[]
  suggestedAdjustment?: string
}

export interface DomainConfig {
  label: string
  icon: LucideIcon
  color: string
}

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  badge: number
}

// --- Insights types ---

export interface AuthorityAdjustment {
  id: string
  partnerId: string
  ruleId: string
  title: string
  evidence: string
  implication: string
  riskNote: string
  currentLevel: AuthorityLevel
  suggestedLevel: AuthorityLevel
}

export type GuidanceType =
  | "recovery_buffer"
  | "colocation"
  | "logistics"
  | "preference_learning"
  | "relationship_nudge"

export interface ProactiveGuidance {
  id: string
  type: GuidanceType
  partnerId: string
  title: string
  description: string
  actions: { label: string; variant: "primary" | "secondary" | "ghost" }[]
}

export interface MonthlyMetric {
  month: string
  value: number
}

export interface PatternReport {
  overrideRateTrend: MonthlyMetric[]
  exceptionVolumeTrend: MonthlyMetric[]
  automationTrustIndex: number
  timeAllocation: { orchestration: number; execution: number; review: number }
}

// --- Partner Profile / Desk Notes types ---

export type PreferenceCategory =
  | "travel"
  | "scheduling"
  | "communication"
  | "expenses"
  | "general"

export interface PartnerPreference {
  id: string
  category: PreferenceCategory
  text: string
  source: "manual" | "learned"
  linkedRuleIds: string[]
  updatedAt: string
  updatedBy: string
}

export interface VIPContact {
  name: string
  relationship: string
  notes: string
}

export interface RecurringCommitment {
  title: string
  frequency: string
  notes: string
}

export interface DeskNote {
  id: string
  timestamp: string
  author: string
  content: string
  pinned: boolean
}

export interface PartnerProfile {
  partnerId: string
  preferences: PartnerPreference[]
  vipContacts: VIPContact[]
  recurringCommitments: RecurringCommitment[]
  escalationNotes: string
  deskNotes: DeskNote[]
  coverageHandoff: string
  lastUpdated: string
  lastUpdatedBy: string
}
