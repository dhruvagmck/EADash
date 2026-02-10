import type { SignalBlockData } from "./types"

export const signalBlocks: SignalBlockData[] = [
  // Sarah Chen signals
  {
    id: "sig-sc-client",
    partnerId: "partner-1",
    domain: "client-facing",
    count: 1,
    severity: "review",
    summary: "Board brief due in 48h, draft ready",
    detailItems: [
      "Q1 Board Briefing Document — AI draft ready for review — due Feb 11",
    ],
  },
  {
    id: "sig-sc-sched",
    partnerId: "partner-1",
    domain: "internal-scheduling",
    count: 3,
    severity: "review",
    summary: "2 conflicts, 1 external pending",
    detailItems: [
      "Board prep meeting conflicts with client call at 2:00 PM tomorrow",
      "External meeting with Deloitte awaiting confirmation (48h+)",
      "Team standup moved to 9:30 AM — auto-approved",
    ],
  },
  {
    id: "sig-sc-travel",
    partnerId: "partner-1",
    domain: "travel-expenses",
    count: 3,
    severity: "running",
    summary: "LHR→JFK confirmed, 2 receipts filed",
    detailItems: [
      "BA 178 LHR→JFK, Feb 14, Business Class, Aisle seat — confirmed",
      "Dinner at Nobu — $847 — auto-categorized as Client Entertainment",
      "Uber to LHR — $62 — auto-categorized as Ground Transport",
    ],
  },
  {
    id: "sig-sc-time",
    partnerId: "partner-1",
    domain: "timesheets",
    count: 2,
    severity: "review",
    summary: "1 timesheet pending, 1 entry flagged",
    detailItems: [
      "Weekly timesheet for Feb 3–7 pending Sarah's approval — due today",
      "Flagged: 12h logged to Acme Corp project on Feb 6 exceeds daily norm",
    ],
  },
  {
    id: "sig-sc-email",
    partnerId: "partner-1",
    domain: "email-triage",
    count: 5,
    severity: "urgent",
    summary: "3 drafts held, 2 urgent replies",
    detailItems: [
      "URGENT: Reply to Goldman Sachs re: Q1 strategy review — overdue 4h",
      "URGENT: Board secretary follow-up on agenda items — overdue 2h",
      "Draft: Client briefing note for Acme Corp partnership",
      "Draft: Internal memo on Q2 staffing allocation",
      "Draft: Thank-you note to JP Morgan dinner attendees",
    ],
  },

  // James Whitfield signals
  {
    id: "sig-jw-client",
    partnerId: "partner-2",
    domain: "client-facing",
    count: 2,
    severity: "running",
    summary: "2 docs in preparation",
    detailItems: [
      "Client presentation for Henderson Group — formatting in progress",
      "Travel itinerary summary — auto-generated",
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
      "CONFLICT: Board meeting overlaps with McKinsey partner lunch on Feb 12",
      "Double-booking detected: Two client calls at 3:00 PM on Feb 11",
    ],
  },
  {
    id: "sig-jw-travel",
    partnerId: "partner-2",
    domain: "travel-expenses",
    count: 4,
    severity: "review",
    summary: "CDG→LHR delayed, 2 rebooking options",
    detailItems: [
      "AF 1680 CDG→LHR delayed 3h — connecting to NYC flight at risk",
      "Rebooking option A: BA 308 CDG→LHR 14:00, connects to BA 178 LHR→JFK",
      "Rebooking option B: Direct AF 22 CDG→JFK 17:30, arrives 20:00 local",
      "Hotel Le Meurice checkout extended to accommodate delay",
    ],
  },
  {
    id: "sig-jw-time",
    partnerId: "partner-2",
    domain: "timesheets",
    count: 1,
    severity: "running",
    summary: "Auto-submitted for week",
    detailItems: [
      "Weekly timesheet for Feb 3–7 auto-submitted — 42h across 5 client engagements",
    ],
  },
  {
    id: "sig-jw-email",
    partnerId: "partner-2",
    domain: "email-triage",
    count: 3,
    severity: "review",
    summary: "2 drafts held, 1 follow-up due",
    detailItems: [
      "Draft: Reply to KPMG re: joint venture proposal",
      "Draft: Client update email for Henderson Group",
      "Follow-up overdue: No response from Barclays on Feb 5 meeting request",
    ],
  },
]
