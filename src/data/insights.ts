import type {
  AuthorityAdjustment,
  ProactiveGuidance,
  PatternReport,
} from "./types"

export const authorityAdjustments: AuthorityAdjustment[] = [
  {
    id: "adj-1",
    partnerId: "partner-1",
    ruleId: "rule-sc-sched-3",
    title:
      "Upgrade 'Send external meeting confirmations' from SHOULD → CAN for Sarah Chen",
    evidence:
      "You approved 7 of 8 items without modification (88% pass-through) in the last 30 days.",
    implication:
      "If upgraded, saves ~1.5 hours/month of review time.",
    riskNote:
      "The 1 modified item involved a VIP attendee. Consider keeping VIP confirmations as SHOULD.",
    currentLevel: "SHOULD",
    suggestedLevel: "CAN",
  },
  {
    id: "adj-2",
    partnerId: "partner-2",
    ruleId: "rule-jw-corr-2",
    title:
      "Upgrade 'Send follow-up reminders' from SHOULD → CAN for James Whitfield",
    evidence:
      "You approved 4 of 5 follow-up reminders without changes (80% pass-through) in the last 30 days.",
    implication:
      "If upgraded, follow-ups send automatically, saving ~45 min/month.",
    riskNote:
      "The 1 modified item was a first-contact follow-up. Consider keeping new-prospect follow-ups as SHOULD.",
    currentLevel: "SHOULD",
    suggestedLevel: "CAN",
  },
]

export const proactiveGuidance: ProactiveGuidance[] = [
  {
    id: "guide-1",
    type: "recovery_buffer",
    partnerId: "partner-1",
    title: "Recovery buffer recommended for Sarah Chen",
    description:
      "Sarah has had 7+ hours of meetings daily for 4 days. Consider blocking Friday afternoon to prevent burnout.",
    actions: [
      { label: "Block 2h", variant: "primary" },
      { label: "Dismiss", variant: "ghost" },
    ],
  },
  {
    id: "guide-2",
    type: "colocation",
    partnerId: "partner-1",
    title: "Co-location opportunity: NYC next week",
    description:
      "Sarah and James are both in NYC Feb 14–16. Consider co-locating meetings to reduce fragmentation.",
    actions: [
      { label: "View both schedules", variant: "primary" },
      { label: "Dismiss", variant: "ghost" },
    ],
  },
  {
    id: "guide-3",
    type: "logistics",
    partnerId: "partner-2",
    title: "Linked booking opportunity: Paris trip",
    description:
      "James's CDG→LHR trip could connect with a Paris client dinner already on calendar. Currently separate itineraries.",
    actions: [
      { label: "Link bookings", variant: "primary" },
      { label: "Dismiss", variant: "ghost" },
    ],
  },
]

export const patternReport: PatternReport = {
  overrideRateTrend: [
    { month: "Sep", value: 28 },
    { month: "Oct", value: 22 },
    { month: "Nov", value: 19 },
    { month: "Dec", value: 16 },
    { month: "Jan", value: 14 },
    { month: "Feb", value: 12 },
  ],
  exceptionVolumeTrend: [
    { month: "Sep", value: 18 },
    { month: "Oct", value: 15 },
    { month: "Nov", value: 12 },
    { month: "Dec", value: 10 },
    { month: "Jan", value: 8 },
    { month: "Feb", value: 6 },
  ],
  automationTrustIndex: 74,
  timeAllocation: {
    orchestration: 45,
    execution: 25,
    review: 30,
  },
}
