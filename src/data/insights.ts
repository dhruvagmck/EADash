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
      "Consider upgrading 'Send confirmations to external meeting attendees' from SHOULD to CAN for Sarah Chen",
    evidence:
      "In the last 30 days, you approved 7 of 8 items under this rule without modification (88% pass-through rate).",
    implication:
      "If upgraded to CAN, AdminBuddy will execute these autonomously, saving ~1.5 hours/month of review time.",
    riskNote:
      "The 1 modified item involved a VIP attendee (Goldman Sachs). You could add a condition to keep VIP-related confirmations as SHOULD while upgrading the rest.",
    currentLevel: "SHOULD",
    suggestedLevel: "CAN",
  },
  {
    id: "adj-2",
    partnerId: "partner-2",
    ruleId: "rule-jw-corr-2",
    title:
      "Consider upgrading 'Send follow-up reminders to external contacts' from SHOULD to CAN for James Whitfield",
    evidence:
      "In the last 30 days, you approved 4 of 5 follow-up reminders without changes (80% pass-through rate).",
    implication:
      "If upgraded to CAN, follow-up nudges will send automatically, saving ~45 minutes/month.",
    riskNote:
      "The 1 modified item was a follow-up to a brand-new prospect (Barclays). Consider keeping first-contact follow-ups as SHOULD.",
    currentLevel: "SHOULD",
    suggestedLevel: "CAN",
  },
  {
    id: "adj-3",
    partnerId: "partner-1",
    ruleId: "rule-sc-corr-1",
    title:
      "Keep 'Draft client-facing correspondence' as SHOULD for Sarah Chen — modification rate is significant",
    evidence:
      "In the last 30 days, you modified 8 of 23 items under this rule (35% modification rate).",
    implication:
      "This rule is correctly calibrated. The modifications typically involve tone adjustments for specific clients.",
    riskNote:
      "No upgrade recommended. Consider adding client-specific conditions: Goldman Sachs and Acme Corp drafts are most frequently modified.",
    currentLevel: "SHOULD",
    suggestedLevel: "SHOULD",
  },
]

export const proactiveGuidance: ProactiveGuidance[] = [
  {
    id: "guide-1",
    type: "recovery_buffer",
    partnerId: "partner-1",
    title: "Recovery buffer recommended for Sarah Chen",
    description:
      "Sarah has had 7+ hours of meetings daily for the last 4 days. Consider blocking a recovery buffer on Friday afternoon to prevent burnout.",
    actions: [
      { label: "Block 2h", variant: "primary" },
      { label: "Block 3h", variant: "secondary" },
      { label: "Dismiss", variant: "ghost" },
    ],
  },
  {
    id: "guide-2",
    type: "colocation",
    partnerId: "partner-1",
    title: "Co-location opportunity: NYC next week",
    description:
      "Sarah Chen and James Whitfield are both traveling to NYC Feb 14–16. Consider co-locating meetings to reduce schedule fragmentation and share ground transport.",
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
      "James Whitfield's CDG→LHR trip on Feb 10 could connect with the Paris client dinner already on calendar. Currently booked as separate itineraries.",
    actions: [
      { label: "View itinerary", variant: "primary" },
      { label: "Link bookings", variant: "secondary" },
      { label: "Dismiss", variant: "ghost" },
    ],
  },
  {
    id: "guide-4",
    type: "preference_learning",
    partnerId: "partner-2",
    title: "Preference detected: James prefers aisle seats",
    description:
      "James has requested or been assigned aisle seats on the last 8 flights, but 'aisle seat' is already in desk notes. However, he's also requested extra legroom 6 of 8 times — this isn't captured yet.",
    actions: [
      { label: "Add to desk notes", variant: "primary" },
      { label: "Dismiss", variant: "ghost" },
    ],
  },
  {
    id: "guide-5",
    type: "relationship_nudge",
    partnerId: "partner-1",
    title: "Relationship check: Deloitte partnership",
    description:
      "It's been 45 days since Sarah's last substantive contact with David Park at Deloitte. Previous cadence was every 2–3 weeks during the partnership discussion.",
    actions: [
      { label: "Flag to Partner", variant: "secondary" },
      { label: "Schedule catch-up", variant: "primary" },
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
