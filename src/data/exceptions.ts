import type { ExceptionItem } from "./types"

// ── Predicted Exceptions (AI-predicted risks that haven't occurred yet) ──

export const predictedExceptions: ExceptionItem[] = [
  {
    id: "pred-1",
    partnerId: "partner-1",
    title: "73% probability: BA289 LHR→JFK delayed — storm system in North Atlantic",
    severity: "P2",
    timestamp: "Predicted 18 min ago",
    domains: ["travel-expenses", "internal-scheduling"],
    situationSummary:
      "Weather models show a developing storm system in the North Atlantic corridor. Sarah Chen's BA289 flight tomorrow (Feb 12, 08:40 LHR→JFK) has a 73% probability of significant delay based on route weather analysis, BA's historical on-time performance in similar conditions, and current ATC advisories. If delayed >2 hours, her 4:00 PM client meeting with Acme Corp in NYC is at risk.",
    entityChips: ["Sarah Chen", "BA289", "Storm Advisory", "Acme Corp Meeting"],
    options: [
      {
        id: "pred-1-opt-1",
        title: "Pre-book backup: VS3 departing 06:15",
        description: "Reserve Virgin Atlantic VS3 LHR→JFK departing 06:15 as a fallback. Cancel if BA289 runs on time. Free cancellation until 2h before departure.",
        tradeoffs: "Requires Sarah to wake 2h earlier if activated. +$0 with free cancellation. Arrives 09:30 — ample buffer for 4:00 PM meeting.",
        downstreamEffects: "Backup reservation held. Ground transport pre-staged for both arrival times. Calendar holds adjusted if activated.",
        confidence: "Recommended",
      },
      {
        id: "pred-1-opt-2",
        title: "Move Acme meeting to virtual as precaution",
        description: "Proactively switch the 4:00 PM Acme Corp meeting to Teams. Preserves meeting regardless of flight outcome.",
        tradeoffs: "Loses the in-person relationship value Sarah planned. Client may perceive as deprioritization. No travel cost impact.",
        downstreamEffects: "Calendar updated. Teams link generated. Client EA notified of format change.",
        confidence: "Viable",
      },
    ],
    prediction: {
      probability: 0.73,
      basis: "Weather pattern analysis + airline historical performance",
      timeHorizon: "~14 hours (flight departs tomorrow 08:40)",
      dataPoints: [
        "North Atlantic storm system forecast — 85% chance of ATC ground delays at LHR",
        "BA289 on-time rate drops to 31% in similar weather conditions (last 18 months)",
        "3 active METARs with deteriorating visibility along route corridor",
        "2 other BA transatlantic flights already showing pre-delay advisories",
      ],
    },
  },
  {
    id: "pred-2",
    partnerId: "partner-2",
    title: "61% probability: Scheduling collision next Wednesday — client review vs. board prep",
    severity: "P3",
    timestamp: "Predicted 42 min ago",
    domains: ["internal-scheduling", "client-facing"],
    situationSummary:
      "James Whitfield's calendar for next Wednesday (Feb 19) shows converging pressure. The Henderson Group quarterly review is tentatively targeting 2:00 PM (client EA has not confirmed), and the internal board prep session is being scheduled for the same afternoon by the CFO's office. Based on scheduling patterns, there is a 61% probability both land in the 2:00–4:00 PM window.",
    entityChips: ["James Whitfield", "Henderson Group", "Board Prep", "Feb 19"],
    options: [
      {
        id: "pred-2-opt-1",
        title: "Proactively block 2:00–4:00 PM for Henderson",
        description: "Reach out to Henderson Group EA now to lock in 2:00 PM, then steer board prep to morning.",
        tradeoffs: "Secures the client slot early. Board prep may need to compress into a less ideal morning window.",
        downstreamEffects: "Email drafted to Henderson EA. Calendar hold placed. CFO office notified of morning preference for board prep.",
        confidence: "Recommended",
      },
      {
        id: "pred-2-opt-2",
        title: "Monitor — intervene if both confirm same slot",
        description: "Wait for both to firm up. Intervene only if they actually collide.",
        tradeoffs: "Avoids unnecessary action. Risk: if both confirm simultaneously, resolution is harder and client EA may feel deprioritized.",
        downstreamEffects: "Monitoring alert set. EA notified immediately if both confirm overlapping times.",
        confidence: "Viable",
      },
    ],
    prediction: {
      probability: 0.61,
      basis: "Calendar trend analysis + scheduling pattern recognition",
      timeHorizon: "~7 days (target date: Feb 19)",
      dataPoints: [
        "Henderson Group reviews historically land on Wednesdays 2–4 PM (8 of last 10 quarters)",
        "CFO office has requested 'afternoon next Wednesday' for board prep — 78% of their requests resolve to 2:00 PM",
        "James's Wednesday calendar already 70% full — only 2:00–5:00 PM remains open",
      ],
    },
  },
]

// ── Active Exceptions (situations that have already occurred) ──

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
