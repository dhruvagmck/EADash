import type { SupervisionItem } from "./types"

export const supervisionItems: SupervisionItem[] = [
  {
    id: "sup-1",
    partnerId: "partner-1",
    domain: "correspondence",
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
        "Dear Michael,\n\nThank you for reaching out regarding the Q1 strategy review. I would be delighted to meet during the week of February 17th.\n\nI have availability on Tuesday 18th at 10:00 AM or Wednesday 19th at 2:00 PM (EST). Please let me know which works best for your team.\n\nWarm regards,\nSarah",
    },
    reasoning:
      "This action was held because: 'Client correspondence rule' requires EA review for all outbound emails to external clients. AdminBuddy's reasoning: Goldman Sachs is flagged as a Tier 1 client. The draft uses Sarah's standard tone and references her actual calendar availability.",
    preferences: ["Formal tone for banking clients", "Always offer 2 time slots", "Sign off with 'Warm regards'"],
    context:
      "Michael Peterson last emailed on Feb 7 requesting a meeting. This is a follow-up to the Dec Q4 review. Goldman Sachs is a top-5 client by revenue.",
    ruleId: "rule-sc-corr-1",
  },
  {
    id: "sup-2",
    partnerId: "partner-1",
    domain: "correspondence",
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
        "Hi Patricia,\n\nConfirming that Sarah will present the Market Expansion update in Slot 3 (approximately 11:15 AM). The supporting materials will be circulated by end of day Thursday.\n\nPlease let me know if any changes to the running order.\n\nBest,\nAlex (EA to Sarah Chen)",
    },
    reasoning:
      "This action was held because: 'Board communication rule' requires EA review for all board-related correspondence. This email confirms agenda placement and commits to a materials deadline.",
    preferences: ["Board emails: formal but efficient", "Always confirm materials deadline"],
    context:
      "Q1 Board meeting is Feb 20. Sarah is presenting Market Expansion. Materials deadline is typically 48h before.",
    ruleId: "rule-sc-corr-2",
  },
  {
    id: "sup-3",
    partnerId: "partner-2",
    domain: "travel",
    title: "Flight rebooking: CDG→LHR, 2 options for James Whitfield",
    timeAgo: "45m ago",
    minutesAgo: 45,
    authorityTag: "SHOULD — International travel rule",
    proposedAction: {
      type: "booking",
      preview:
        "RECOMMENDED: BA 308 CDG→LHR departing 14:00, arriving 14:15 (local). Business class, aisle seat 2A. Connects to BA 178 LHR→JFK at 18:30. Total cost impact: +$340.\n\nALTERNATIVE: Direct AF 22 CDG→JFK departing 17:30, arriving 20:00 (local). Business class, aisle seat 3C. No connection needed. Total cost impact: +$890.",
    },
    reasoning:
      "This action was held because: 'International travel rule' requires EA confirmation for all international flight changes. SkyLink detected a 3-hour delay on the original AF 1680 CDG→LHR which jeopardizes the NYC connection.",
    preferences: ["Prefers British Airways", "Always aisle seat", "Minimize connection risk"],
    context:
      "James has a client dinner in NYC on Feb 14 at 20:30. The direct flight option (AF 22) arrives 20:00 — tight but feasible. The BA connection option has a 4h15m buffer at LHR.",
    ruleId: "rule-jw-travel-1",
  },
  {
    id: "sup-4",
    partnerId: "partner-1",
    domain: "scheduling",
    title: "Reschedule: Board prep conflicts with Acme Corp call",
    timeAgo: "1h ago",
    minutesAgo: 60,
    authorityTag: "SHOULD — External meeting reschedule",
    proposedAction: {
      type: "scheduling",
      preview:
        "Move Board Prep session from 2:00 PM to 4:00 PM on Feb 10. This resolves the conflict with the Acme Corp partnership call (2:00–3:00 PM). All board prep attendees have availability at 4:00 PM. Room 14B is available.",
    },
    reasoning:
      "This action was held because: 'External meeting reschedule' requires EA review when an internal meeting is moved to accommodate an external commitment. The Acme Corp call was scheduled after the board prep.",
    preferences: ["Client meetings take priority over internal prep", "Keep board prep same-day if possible"],
    context:
      "Board prep involves 4 internal attendees. Acme Corp call is with their CEO — high priority. Board meeting is Feb 20, so prep on Feb 10 still gives 10 days lead time.",
    ruleId: "rule-sc-sched-2",
  },
  {
    id: "sup-5",
    partnerId: "partner-2",
    domain: "correspondence",
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
        "Dear Rika,\n\nThank you for the comprehensive proposal. I have reviewed the preliminary terms and believe there is strong alignment on the core objectives.\n\nI suggest we schedule a working session with our respective teams during the week of February 24th to discuss the commercial framework in detail.\n\nI will have my team circulate a proposed agenda by end of next week.\n\nKind regards,\nJames",
    },
    reasoning:
      "This action was held because: 'Client correspondence rule' requires EA review. This email contains a commitment to schedule a meeting and circulate materials, both of which have downstream implications.",
    preferences: ["Formal tone with Japanese counterparts", "Never commit to specific dates without checking calendar"],
    context:
      "KPMG sent their joint venture proposal on Feb 3. James reviewed it verbally and asked AdminBuddy to draft a response expressing interest. Week of Feb 24 is currently 60% booked.",
    ruleId: "rule-jw-corr-1",
  },
  {
    id: "sup-6",
    partnerId: "partner-1",
    domain: "expenses",
    title: "Expense flag: Client dinner over $500 threshold",
    timeAgo: "30m ago",
    minutesAgo: 30,
    authorityTag: "SHOULD — High-value expense review",
    proposedAction: {
      type: "expense",
      preview:
        "Expense: Dinner at Nobu, Feb 7\nAmount: $847.00\nCategory: Client Entertainment\nAttendees: Sarah Chen, Michael Peterson (Goldman Sachs), Lisa Wang (Goldman Sachs)\nReceipt: Attached\nPolicy: Over $500 client entertainment threshold — requires EA confirmation before submission.",
    },
    reasoning:
      "This action was held because: 'High-value expense review' requires EA confirmation for client entertainment expenses over $500. AdminBuddy auto-categorized and matched attendees from Sarah's calendar.",
    preferences: ["Always include attendee names from calendar", "Categorize as Client Entertainment when external guests present"],
    context:
      "Sarah's expense policy allows up to $1,200 for client dinners with prior approval. This dinner was with Goldman Sachs contacts during the Q4 review period.",
    ruleId: "rule-sc-exp-1",
  },
  {
    id: "sup-7",
    partnerId: "partner-2",
    domain: "scheduling",
    title: "Double-booking resolution: Two client calls at 3:00 PM Feb 11",
    timeAgo: "20m ago",
    minutesAgo: 20,
    authorityTag: "SHOULD — Scheduling conflict rule",
    proposedAction: {
      type: "scheduling",
      preview:
        "CONFLICT: Henderson Group call and Barclays follow-up both at 3:00 PM Feb 11.\n\nProposed resolution: Keep Henderson Group at 3:00 PM (higher priority — active engagement). Move Barclays to 4:30 PM Feb 11 (Rachel Davies confirmed availability). Send reschedule notice to Barclays with apology.",
    },
    reasoning:
      "This action was held because: 'Scheduling conflict rule' requires EA review for all double-booking resolutions involving external parties. Both are client meetings.",
    preferences: ["Active engagements take priority over prospecting", "Always apologize when rescheduling externals"],
    context:
      "Henderson Group is an active $2M engagement. Barclays is a follow-up from a preliminary meeting. James has no other availability on Feb 11 before 4:30 PM.",
    ruleId: "rule-jw-sched-1",
  },
  {
    id: "sup-8",
    partnerId: "partner-1",
    domain: "documents",
    title: "Board briefing document: AI draft ready for review",
    timeAgo: "5h ago",
    minutesAgo: 300,
    authorityTag: "SHOULD — Board document review",
    proposedAction: {
      type: "email_draft",
      subject: "Q1 Board Briefing — Market Expansion Update",
      preview:
        "12-page briefing document covering:\n1. Market Expansion Summary (2 pages)\n2. Revenue Impact Analysis (3 pages)\n3. Competitive Landscape Update (2 pages)\n4. Risk Assessment (2 pages)\n5. Recommendations & Next Steps (3 pages)\n\nAI-generated from Sarah's notes, Q4 data, and market research. Formatted per board template.",
    },
    reasoning:
      "This action was held because: 'Board document review' requires EA quality check before circulation. Document was auto-generated from Sarah's dictated notes and firm data sources.",
    preferences: ["Board docs: formal, concise, data-driven", "Always include risk assessment section", "Use standard board template"],
    context:
      "Due to board secretary by Feb 18 (end of day Thursday). Current date is Feb 9. Sarah typically reviews board docs 5–7 days before deadline.",
    ruleId: "rule-sc-docs-1",
  },
  {
    id: "sup-9",
    partnerId: "partner-2",
    domain: "correspondence",
    title: "Follow-up reminder: Barclays meeting request (no response 4 days)",
    timeAgo: "1h ago",
    minutesAgo: 60,
    authorityTag: "SHOULD — Follow-up nudge rule",
    proposedAction: {
      type: "email_draft",
      to: "r.davies@barclays.com",
      from: "james.whitfield@firm.com",
      subject: "Re: Meeting Request — Following Up",
      preview:
        "Dear Rachel,\n\nI hope this finds you well. I wanted to follow up on my email from February 5th regarding a potential meeting to discuss the advisory engagement.\n\nWould any time during the week of February 17th work for a brief call?\n\nBest regards,\nJames",
    },
    reasoning:
      "This action was held because: 'Follow-up nudge rule' holds auto-generated follow-ups for EA review. The original email was sent Feb 5 with no response after 4 days.",
    preferences: ["Wait 4 business days before first follow-up", "Keep follow-ups brief and low-pressure"],
    context:
      "James emailed Rachel Davies on Feb 5 about an advisory engagement opportunity. Barclays is a prospective client. No prior relationship history in CRM.",
    ruleId: "rule-jw-corr-2",
  },
  {
    id: "sup-10",
    partnerId: "partner-1",
    domain: "scheduling",
    title: "External meeting confirmation: Deloitte partnership discussion",
    timeAgo: "6h ago",
    minutesAgo: 360,
    authorityTag: "SHOULD — External scheduling confirmation",
    proposedAction: {
      type: "scheduling",
      preview:
        "Confirm meeting with Deloitte:\nDate: Feb 13, 10:00 AM EST\nLocation: Firm HQ, Room 22A (booked)\nAttendees: Sarah Chen, David Park (Deloitte), Amy Fitzgerald (Deloitte)\nAgenda: Partnership framework discussion\n\nSend calendar invite with agenda and room details.",
    },
    reasoning:
      "This action was held because: 'External scheduling confirmation' requires EA review before sending confirmations to external parties. Meeting was proposed by Deloitte and Sarah verbally agreed.",
    preferences: ["Always include room details for external visitors", "Send agenda at least 24h before"],
    context:
      "Deloitte partnership discussion has been in progress for 2 months. This is the third meeting. David Park is a Managing Director at Deloitte.",
    ruleId: "rule-sc-sched-3",
  },
]
