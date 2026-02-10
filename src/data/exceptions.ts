import type { ExceptionItem } from "./types"

export const exceptionItems: ExceptionItem[] = [
  {
    id: "exc-1",
    partnerId: "partner-1",
    title: "Scheduling conflict: Board prep vs. mandatory timesheet review",
    severity: "P1",
    timestamp: "12 minutes ago",
    domains: ["internal-scheduling", "timesheets"],
    situationSummary:
      "Sarah Chen's board prep (moved to 4:00 PM for Acme Corp) now conflicts with a mandatory Finance timesheet review. Both meetings are flagged as unmovable — one by client priority, the other by Finance policy. AdminBuddy cannot resolve autonomously.",
    entityChips: ["Sarah Chen", "Acme Corp", "Board Prep", "Finance Review"],
    options: [
      {
        id: "exc-1-opt-1",
        title: "Move board prep to Feb 11 morning",
        description: "Reschedule to Feb 11 at 9:00 AM. All attendees available. Keeps both Feb 10 meetings intact.",
        tradeoffs: "Moves prep to 9 days before board meeting. Uses Sarah's planned focus time on Feb 11.",
        downstreamEffects: "Calendar updates sent to 4 board prep attendees. Feb 11 focus block removed.",
        confidence: "Recommended",
      },
      {
        id: "exc-1-opt-2",
        title: "Shorten board prep to 1 hour at 4:00 PM",
        description: "Compress from 2h to 1h. Timesheet review moves to 5:00 PM.",
        tradeoffs: "Board prep may be rushed. Timesheet review pushed to end of day.",
        downstreamEffects: "Both meetings stay on Feb 10. Calendar updates sent automatically.",
        confidence: "Viable",
      },
    ],
  },
  {
    id: "exc-2",
    partnerId: "partner-2",
    title: "Travel disruption: Paris delay threatens NYC client dinner",
    severity: "P2",
    timestamp: "45 minutes ago",
    domains: ["travel-expenses", "internal-scheduling"],
    situationSummary:
      "James Whitfield's CDG→LHR flight is delayed 3h, putting his NYC connection at risk. He has a relationship-closing dinner with Henderson Group ($2M engagement) at 8:30 PM. Two rebooking options available but require EA approval for international changes.",
    entityChips: ["James Whitfield", "Henderson Group", "CDG→LHR", "NYC Dinner"],
    options: [
      {
        id: "exc-2-opt-1",
        title: "Rebook via BA connection at LHR",
        description: "BA 308 CDG→LHR at 14:00, connect to BA 178 LHR→JFK at 18:30. Arrives 21:00 — joins dinner 30min late.",
        tradeoffs: "+$340. Arrives late but 4h15m connection buffer. London morning meeting missed.",
        downstreamEffects: "BA bookings confirmed. Apology sent to London attendees. Ground transport booked JFK→restaurant.",
        confidence: "Recommended",
      },
      {
        id: "exc-2-opt-2",
        title: "Direct flight CDG→JFK (skip London)",
        description: "AF 22 CDG→JFK at 17:30, arrives 20:00. Plenty of time for dinner.",
        tradeoffs: "+$890. London meeting and office visit cancelled entirely.",
        downstreamEffects: "AF booking confirmed. London meeting cancelled with apologies. LHR hotel cancelled.",
        confidence: "Viable",
      },
    ],
  },
  {
    id: "exc-4",
    partnerId: "partner-2",
    title: "Expense policy: Paris hotel exceeds per-night limit",
    severity: "P3",
    timestamp: "5 hours ago",
    domains: ["travel-expenses"],
    situationSummary:
      "James's Le Meurice stay was $1,200/night vs. $800 policy limit. Booked per desk note preference. 3 nights, total overage: $1,200. Requires policy exception approval.",
    entityChips: ["James Whitfield", "Le Meurice", "$1,200/night", "Policy: $800"],
    options: [
      {
        id: "exc-4-opt-1",
        title: "Submit with policy exception",
        description: "Submit with justification: 'Partner preference hotel per desk notes. Client meetings held at hotel.'",
        tradeoffs: "Most likely approved given documentation. 3–5 day review cycle.",
        downstreamEffects: "Expense submitted with exception flag. James notified.",
        confidence: "Recommended",
      },
      {
        id: "exc-4-opt-2",
        title: "Escalate to James for decision",
        description: "Forward the policy exceedance to James directly.",
        tradeoffs: "Adds to his workload for an admin matter. But he may prefer to handle given the amount.",
        downstreamEffects: "Email sent to James with options. EA monitors for response.",
        confidence: "Viable",
      },
    ],
  },
]
