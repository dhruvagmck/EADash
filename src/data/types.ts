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
  avatarUrl?: string
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

export interface PendingInputItem {
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

export interface PredictionMetadata {
  probability: number         // 0.0–1.0 (e.g., 0.73)
  basis: string               // "Weather patterns + historical delay data"
  timeHorizon: string         // "~6 hours"
  dataPoints: string[]        // evidence bullets
  preStaged?: boolean         // has the EA pre-staged a response?
}

export interface DecisionItem {
  id: string
  partnerId: string
  title: string
  severity: ExceptionSeverity
  timestamp: string
  domains: Domain[]
  situationSummary: string
  entityChips: string[]
  options: ResolutionOption[]
  prediction?: PredictionMetadata  // present = predicted risk, absent = active exception
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
  | "timesheets"
  | "general"

export type PreferenceSource = "manual" | "learned" | "outlook" | "calendar"

export type SeatPreference = "window" | "middle" | "aisle" | ""
export type CabinClass = "economy" | "premium-economy" | "business" | "first" | ""
export type RedEyePolicy = "allow" | "never"
export type TonePreset = "formal" | "conversational" | "neutral"

// ── Structured Preferences by Domain ──

export interface TravelPreferences {
  seatShortHaul: SeatPreference
  seatLongHaul: SeatPreference
  preferredAirlines: string[]
  avoidAirlines: string[]
  preferredHotels: string[]
  avoidHotels: string[]
  cabinDomestic: CabinClass
  cabinInternational: CabinClass
  redEyePolicy: RedEyePolicy
}

export interface SchedulingPreferences {
  earliestMeeting: string // "09:00"
  latestMeeting: string   // "17:30"
  timezone: string
  protectedBlocks: ProtectedBlock[]
  maxMeetingsPerDay: number | null
  lightDays: string[]     // ["Friday"]
}

export interface ProtectedBlock {
  id: string
  days: string[]          // ["Tuesday", "Thursday"]
  startTime: string       // "12:00"
  endTime: string         // "13:00"
  label: string           // "Gym"
  source: PreferenceSource
}

export interface CommunicationPreferences {
  defaultTone: TonePreset
  defaultSignOff: string
  internalChannel: string // "Teams" | "Email" | "Slack"
}

export interface ExpensePreferences {
  submissionCadence: string // "ad-hoc" | "weekly" | "bi-weekly" | "monthly"
  preferredSubmissionDay: string
  receiptDetailLevel: string // "minimal" | "standard" | "detailed"
  defaultCategories: string[]
  approvalThreshold: number | null // dollar amount
}

export interface StructuredPreferences {
  travel: TravelPreferences
  scheduling: SchedulingPreferences
  communication: CommunicationPreferences
  expenses: ExpensePreferences
}

// ── Timesheet Tracking ──

export interface ChargeCode {
  id: string
  code: string
  clientName: string
  engagementName: string
  budgetedDays: number
  usedDays: number
  colorAccent: string
}

export interface TimesheetPeriod {
  id: string
  label: string           // "Feb 1–15, 2026"
  startDate: string
  endDate: string
  status: "draft" | "submitted" | "approved" | "overdue"
  totalDays: number
  entries: TimesheetEntry[]
}

export interface TimesheetEntry {
  date: string
  chargeCodeId: string
  days: number            // typically 1 (standard 7h day)
  location: string        // auto-inferred from travel data
  locationSource: "travel-inferred" | "manual" | "default-office"
  type: "billable" | "pto" | "public-holiday" | "sick" | "training"
  typeSource: PreferenceSource // "calendar" for PTO/holidays
  notes: string
}

export interface MonthlyUtilization {
  month: string           // "2026-02"
  totalWorkingDays: number
  billableDays: number
  ptoDays: number
  holidayDays: number
  byChargeCode: { chargeCodeId: string; days: number }[]
}

export interface TimesheetData {
  chargeCodes: ChargeCode[]
  currentPeriod: TimesheetPeriod
  recentPeriods: TimesheetPeriod[]
  utilization12m: MonthlyUtilization[]
  standardDayHours: number // always 7
  submissionCadence: "semi-monthly" // always 1st-15th and 16th-end
  notes: string[]
}

// ── Legacy free-text preferences (still used for additional notes) ──

export interface PartnerPreference {
  id: string
  category: PreferenceCategory
  text: string
  source: PreferenceSource
  linkedRuleIds: string[]
  updatedAt: string
  updatedBy: string
}

// ── Key People (Outlook-enriched) ──

export interface VIPContact {
  name: string
  relationship: string
  notes: string
  source: "manual" | "outlook-inferred" | "outlook-confirmed"
  interactionStats?: {
    emailCount30d: number
    meetingCount30d: number
    lastInteraction: string
  }
  status: "confirmed" | "suggested" | "dismissed"
  avatarUrl?: string
}

// ── Recurring Commitments (Calendar-enriched) ──

export interface RecurringCommitment {
  title: string
  frequency: string
  notes: string
  source: "manual" | "calendar-inferred" | "calendar-confirmed"
  calendarEventId?: string
  nextOccurrence?: string
  confidence?: number     // 0–1 for inferred items
  status: "confirmed" | "suggested" | "dismissed"
}

export interface DeskNote {
  id: string
  timestamp: string
  author: string
  content: string
  pinned: boolean
}

// ── Ambient Learning from Communications ──

export type InsightSource = "email" | "calendar" | "chat" | "travel-history" | "expense-patterns"

export interface AmbientInsight {
  id: string
  partnerId: string
  source: InsightSource
  observation: string         // "Partner consistently declines meetings before 9 AM"
  evidence: string            // "7 of last 10 pre-9AM meetings declined (last 30 days)"
  suggestedAction: {
    type: "preference" | "authority-rule" | "desk-note"
    description: string       // "Add scheduling rule: No meetings before 9 AM"
    domain?: PreferenceCategory
  }
  confidence: number          // 0.0–1.0
  observedOver: string        // "Last 30 days"
  status: "active" | "accepted" | "dismissed"
}

export interface PartnerProfile {
  partnerId: string
  structuredPreferences: StructuredPreferences
  timesheetData: TimesheetData
  preferences: PartnerPreference[]  // free-text additional notes per category
  vipContacts: VIPContact[]
  recurringCommitments: RecurringCommitment[]
  escalationNotes: string
  deskNotes: DeskNote[]
  coverageHandoff: string
  lastUpdated: string
  lastUpdatedBy: string
}
