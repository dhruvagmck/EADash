import type { SignalBlockData } from "./types"

export const signalBlocks: SignalBlockData[] = [
  // Sarah Chen signals
  {
    id: "sig-sc-client",
    partnerId: "partner-1",
    domain: "client-facing",
    count: 1,
    severity: "review",
    summary: "Board brief due in 48h",
    detailItems: [
      "Q1 Board Briefing — AI draft ready for review — due Feb 11",
    ],
  },
  {
    id: "sig-sc-sched",
    partnerId: "partner-1",
    domain: "internal-scheduling",
    count: 2,
    severity: "review",
    summary: "2 scheduling conflicts",
    detailItems: [
      "Board prep conflicts with Acme Corp call at 2:00 PM tomorrow",
      "Deloitte meeting awaiting confirmation (48h+)",
    ],
  },
  {
    id: "sig-sc-travel",
    partnerId: "partner-1",
    domain: "travel-expenses",
    count: 2,
    severity: "running",
    summary: "LHR→JFK confirmed, 1 receipt",
    detailItems: [
      "BA 178 LHR→JFK, Feb 14 — confirmed",
      "Nobu dinner — $847 — auto-categorized",
    ],
  },
  {
    id: "sig-sc-email",
    partnerId: "partner-1",
    domain: "email-triage",
    count: 3,
    severity: "urgent",
    summary: "2 urgent replies, 1 draft held",
    detailItems: [
      "URGENT: Reply to Goldman Sachs — overdue 4h",
      "URGENT: Board secretary follow-up — overdue 2h",
      "Draft: Acme Corp partnership briefing note",
    ],
  },

  // James Whitfield signals
  {
    id: "sig-jw-client",
    partnerId: "partner-2",
    domain: "client-facing",
    count: 1,
    severity: "running",
    summary: "1 doc in preparation",
    detailItems: [
      "Henderson Group presentation — formatting in progress",
    ],
  },
  {
    id: "sig-jw-sched",
    partnerId: "partner-2",
    domain: "internal-scheduling",
    count: 2,
    severity: "urgent",
    summary: "1 VIP conflict, 1 double-book",
    detailItems: [
      "CONFLICT: Board meeting overlaps McKinsey lunch Feb 12",
      "Double-booking: Two client calls at 3:00 PM Feb 11",
    ],
  },
  {
    id: "sig-jw-travel",
    partnerId: "partner-2",
    domain: "travel-expenses",
    count: 2,
    severity: "review",
    summary: "CDG→LHR delayed, rebooking needed",
    detailItems: [
      "AF 1680 CDG→LHR delayed 3h — NYC connection at risk",
      "2 rebooking options available — awaiting approval",
    ],
  },
  {
    id: "sig-jw-email",
    partnerId: "partner-2",
    domain: "email-triage",
    count: 2,
    severity: "review",
    summary: "2 drafts held for review",
    detailItems: [
      "Draft: KPMG joint venture proposal response",
      "Draft: Henderson Group client update",
    ],
  },
]
