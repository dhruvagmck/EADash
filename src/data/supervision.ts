import type { SupervisionItem } from "./types"

export const supervisionItems: SupervisionItem[] = [
  {
    id: "sup-1",
    partnerId: "partner-1",
    domain: "email-triage",
    title: "Draft reply to Goldman Sachs: Q1 strategy review meeting",
    timeAgo: "4h ago",
    minutesAgo: 240,
    authorityTag: "SHOULD — Client correspondence rule",
    proposedAction: {
      type: "email_draft",
      to: "m.peterson@goldmansachs.com",
      from: "sarah.chen@firm.com",
      subject: "Re: Q1 Strategy Review — Scheduling",
      preview:
        "Dear Michael,\n\nThank you for reaching out regarding the Q1 strategy review. I have availability on Tuesday 18th at 10:00 AM or Wednesday 19th at 2:00 PM (EST). Please let me know which works best.\n\nWarm regards,\nSarah",
    },
    reasoning:
      "Held by 'Client correspondence rule' — EA review required for outbound emails to external clients. Goldman Sachs is flagged as Tier 1.",
    preferences: ["Formal tone for banking clients", "Always offer 2 time slots"],
    context:
      "Michael Peterson last emailed Feb 7 requesting a meeting. Goldman Sachs is a top-5 client by revenue.",
    ruleId: "rule-sc-corr-1",
  },
  {
    id: "sup-2",
    partnerId: "partner-1",
    domain: "email-triage",
    title: "Draft reply to Board Secretary: agenda item confirmation",
    timeAgo: "2h ago",
    minutesAgo: 120,
    authorityTag: "SHOULD — Board communication rule",
    proposedAction: {
      type: "email_draft",
      to: "board.secretary@firm.com",
      from: "sarah.chen@firm.com",
      subject: "Re: Q1 Board Meeting — Agenda Confirmation",
      preview:
        "Hi Patricia,\n\nConfirming Sarah will present the Market Expansion update in Slot 3 (~11:15 AM). Supporting materials will be circulated by end of day Thursday.\n\nBest,\nAlex (EA to Sarah Chen)",
    },
    reasoning:
      "Held by 'Board communication rule' — EA review required for all board-related correspondence. Commits to a materials deadline.",
    preferences: ["Board emails: formal but efficient"],
    context:
      "Q1 Board meeting is Feb 20. Sarah is presenting Market Expansion. Materials deadline is typically 48h before.",
    ruleId: "rule-sc-corr-2",
  },
  {
    id: "sup-3",
    partnerId: "partner-2",
    domain: "travel-expenses",
    title: "Flight rebooking: CDG→LHR, 2 options for James Whitfield",
    timeAgo: "45m ago",
    minutesAgo: 45,
    authorityTag: "SHOULD — International travel rule",
    proposedAction: {
      type: "booking",
      preview:
        "RECOMMENDED: BA 308 CDG→LHR at 14:00, connecting BA 178 LHR→JFK at 18:30. Business, aisle 2A. Cost: +$340.\n\nALTERNATIVE: Direct AF 22 CDG→JFK at 17:30, arriving 20:00. Business, aisle 3C. Cost: +$890.",
    },
    reasoning:
      "Held by 'International travel rule' — EA confirmation required for international flight changes. Original AF 1680 delayed 3h, jeopardizing NYC connection.",
    preferences: ["Prefers British Airways", "Always aisle seat", "Minimize connection risk"],
    context:
      "James has a client dinner in NYC on Feb 14 at 20:30. Direct flight arrives 20:00 — tight. BA connection has 4h15m buffer at LHR.",
    ruleId: "rule-jw-travel-1",
  },
  {
    id: "sup-4",
    partnerId: "partner-1",
    domain: "internal-scheduling",
    title: "Reschedule: Board prep conflicts with Acme Corp call",
    timeAgo: "1h ago",
    minutesAgo: 60,
    authorityTag: "SHOULD — External meeting reschedule",
    proposedAction: {
      type: "scheduling",
      preview:
        "Move Board Prep from 2:00 PM to 4:00 PM on Feb 10. Resolves conflict with Acme Corp call (2:00–3:00 PM). All attendees and Room 14B available at 4:00 PM.",
    },
    reasoning:
      "Held by 'External meeting reschedule' — EA review required when internal meetings are moved for external commitments.",
    preferences: ["Client meetings take priority over internal prep"],
    context:
      "Board prep involves 4 attendees. Acme Corp call is with their CEO. Board meeting is Feb 20 — prep on Feb 10 gives 10 days lead.",
    ruleId: "rule-sc-sched-2",
  },
  {
    id: "sup-5",
    partnerId: "partner-2",
    domain: "email-triage",
    title: "Draft: KPMG joint venture proposal response",
    timeAgo: "3h ago",
    minutesAgo: 180,
    authorityTag: "SHOULD — Client correspondence rule",
    proposedAction: {
      type: "email_draft",
      to: "r.nakamura@kpmg.com",
      from: "james.whitfield@firm.com",
      subject: "Re: Joint Venture Exploration — Next Steps",
      preview:
        "Dear Rika,\n\nThank you for the comprehensive proposal. I believe there is strong alignment on the core objectives.\n\nI suggest a working session during the week of February 24th to discuss the commercial framework. My team will circulate a proposed agenda by end of next week.\n\nKind regards,\nJames",
    },
    reasoning:
      "Held by 'Client correspondence rule' — commits to scheduling and materials, both with downstream implications.",
    preferences: ["Formal tone with Japanese counterparts", "Never commit to dates without checking calendar"],
    context:
      "KPMG sent their joint venture proposal Feb 3. James asked AdminBuddy to draft a response. Week of Feb 24 is 60% booked.",
    ruleId: "rule-jw-corr-1",
  },
  {
    id: "sup-7",
    partnerId: "partner-2",
    domain: "internal-scheduling",
    title: "Double-booking resolution: Two client calls at 3:00 PM Feb 11",
    timeAgo: "20m ago",
    minutesAgo: 20,
    authorityTag: "SHOULD — Scheduling conflict rule",
    proposedAction: {
      type: "scheduling",
      preview:
        "CONFLICT: Henderson Group call and Barclays follow-up both at 3:00 PM Feb 11.\n\nProposed: Keep Henderson Group at 3:00 PM (active engagement). Move Barclays to 4:30 PM (Rachel Davies confirmed). Send reschedule notice with apology.",
    },
    reasoning:
      "Held by 'Scheduling conflict rule' — EA review required for double-booking resolutions involving external parties.",
    preferences: ["Active engagements take priority over prospecting"],
    context:
      "Henderson Group is an active $2M engagement. Barclays is a prospective follow-up. No availability before 4:30 PM on Feb 11.",
    ruleId: "rule-jw-sched-1",
  },
]
