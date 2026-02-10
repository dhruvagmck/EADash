import type { PartnerProfile } from "./types"

export const partnerProfiles: PartnerProfile[] = [
  // ── Sarah Chen ──
  {
    partnerId: "partner-1",
    preferences: [
      {
        id: "pref-sc-1",
        category: "travel",
        text: "Prefers morning flights (before 10 AM) for domestic travel",
        source: "manual",
        linkedRuleIds: ["rule-sc-travel-1"],
        updatedAt: "Feb 8, 2026",
        updatedBy: "You",
      },
      {
        id: "pref-sc-2",
        category: "travel",
        text: "Always books aisle seat on flights over 3 hours",
        source: "learned",
        linkedRuleIds: ["rule-sc-travel-1", "rule-sc-travel-2"],
        updatedAt: "Feb 5, 2026",
        updatedBy: "System",
      },
      {
        id: "pref-sc-3",
        category: "travel",
        text: "Preferred hotel chains: Four Seasons, Ritz-Carlton. Never Marriott (bad experience 2024)",
        source: "manual",
        linkedRuleIds: [],
        updatedAt: "Jan 15, 2026",
        updatedBy: "You",
      },
      {
        id: "pref-sc-4",
        category: "scheduling",
        text: "No meetings before 9 AM or after 5:30 PM ET. Exceptions only for board members.",
        source: "manual",
        linkedRuleIds: ["rule-sc-sched-1", "rule-sc-sched-4"],
        updatedAt: "Feb 3, 2026",
        updatedBy: "You",
      },
      {
        id: "pref-sc-5",
        category: "scheduling",
        text: "Protect 12–1 PM for lunch on Tuesdays and Thursdays (gym days)",
        source: "manual",
        linkedRuleIds: ["rule-sc-sched-1"],
        updatedAt: "Jan 20, 2026",
        updatedBy: "You",
      },
      {
        id: "pref-sc-6",
        category: "communication",
        text: "Formal tone for all client-facing emails. Use 'Kind regards' sign-off.",
        source: "manual",
        linkedRuleIds: ["rule-sc-corr-1"],
        updatedAt: "Feb 1, 2026",
        updatedBy: "You",
      },
      {
        id: "pref-sc-7",
        category: "communication",
        text: "CC her Chief of Staff (David Park) on all board-related communications",
        source: "manual",
        linkedRuleIds: ["rule-sc-corr-2"],
        updatedAt: "Jan 28, 2026",
        updatedBy: "You",
      },
      {
        id: "pref-sc-8",
        category: "expenses",
        text: "Client entertainment receipts must include attendee names in the description",
        source: "manual",
        linkedRuleIds: ["rule-sc-exp-1"],
        updatedAt: "Feb 6, 2026",
        updatedBy: "You",
      },
      {
        id: "pref-sc-9",
        category: "general",
        text: "Prefers Teams messages over email for internal quick questions",
        source: "learned",
        linkedRuleIds: [],
        updatedAt: "Feb 4, 2026",
        updatedBy: "System",
      },
    ],
    vipContacts: [
      {
        name: "David Park",
        relationship: "Chief of Staff",
        notes: "CC on all board comms. Direct line for urgent scheduling changes.",
      },
      {
        name: "Margaret Chen",
        relationship: "Spouse",
        notes: "Contact for personal calendar conflicts or family emergency reach-out. Preferred contact: mobile.",
      },
      {
        name: "Robert Tanaka",
        relationship: "Executive Assistant (Board Chair)",
        notes: "Coordinates joint scheduling for board meetings. Very responsive on Teams.",
      },
    ],
    recurringCommitments: [
      {
        title: "Board Meeting",
        frequency: "Quarterly",
        notes: "Third Thursday of Mar, Jun, Sep, Dec. Full day block. Prep docs needed 5 days prior.",
      },
      {
        title: "Leadership Team Standup",
        frequency: "Weekly (Mon 9:30 AM)",
        notes: "30 min. Never reschedule — highest priority internal meeting.",
      },
      {
        title: "Client Portfolio Review",
        frequency: "Bi-weekly (Wed 2 PM)",
        notes: "With Goldman Sachs team. Materials due 24h before.",
      },
      {
        title: "Gym / Personal Time",
        frequency: "Tue & Thu 12–1 PM",
        notes: "Hard block. Only override for P1 client escalations.",
      },
    ],
    escalationNotes:
      "Escalate immediately for: (1) any Goldman Sachs related issues, (2) board member requests, (3) travel changes within 48h of departure. For non-urgent items, batch and present during morning briefing at 9 AM.",
    deskNotes: [
      {
        id: "dn-sc-1",
        timestamp: "Feb 9, 2026 — 4:15 PM",
        author: "You",
        content:
          "Sarah mentioned she's considering switching her preferred airline from Delta to United for the NYC–SFO route due to better lounge access at SFO. Hold off changing travel rules until she confirms after her next trip (Feb 15).",
        pinned: true,
      },
      {
        id: "dn-sc-2",
        timestamp: "Feb 7, 2026 — 10:30 AM",
        author: "You",
        content:
          "Goldman Sachs meeting request reply needed modification — Sarah wants more formal language when dealing with their new VP (Jennifer Walsh). Updated communication preference to reflect this.",
        pinned: false,
      },
      {
        id: "dn-sc-3",
        timestamp: "Feb 3, 2026 — 2:00 PM",
        author: "You",
        content:
          "Sarah declined to reschedule board prep for a vendor meeting. She emphasized board prep is always top priority in the week before a board meeting. Added this as a scheduling constraint.",
        pinned: false,
      },
      {
        id: "dn-sc-4",
        timestamp: "Jan 28, 2026 — 9:00 AM",
        author: "Maria Lopez",
        content:
          "Coverage note: Sarah is particular about her Tuesday/Thursday lunch blocks. She uses them for gym and gets frustrated if they're booked over. Only override for genuine emergencies.",
        pinned: true,
      },
    ],
    coverageHandoff:
      "Sarah is highly organized and expects proactive calendar management. Key things to know: (1) Goldman Sachs is her most important client — always prioritize, (2) Protect Tue/Thu lunch blocks, (3) David Park (CoS) is your go-to for anything board-related, (4) She prefers formal tone in all external comms, (5) Morning briefing at 9 AM is the best time to batch non-urgent items. She travels frequently on domestic routes — prefers morning flights and aisle seats.",
    lastUpdated: "Feb 9, 2026",
    lastUpdatedBy: "You",
  },

  // ── James Whitfield ──
  {
    partnerId: "partner-2",
    preferences: [
      {
        id: "pref-jw-1",
        category: "travel",
        text: "Never book red-eye flights — hard rule, no exceptions",
        source: "manual",
        linkedRuleIds: ["rule-jw-travel-3"],
        updatedAt: "Feb 2, 2026",
        updatedBy: "Maria Lopez",
      },
      {
        id: "pref-jw-2",
        category: "travel",
        text: "Prefers window seat for flights under 3 hours, aisle for longer flights",
        source: "learned",
        linkedRuleIds: ["rule-jw-travel-1"],
        updatedAt: "Jan 28, 2026",
        updatedBy: "System",
      },
      {
        id: "pref-jw-3",
        category: "travel",
        text: "Always book Eurostar over short-haul flights for London–Paris route",
        source: "manual",
        linkedRuleIds: ["rule-jw-travel-2"],
        updatedAt: "Jan 22, 2026",
        updatedBy: "Maria Lopez",
      },
      {
        id: "pref-jw-4",
        category: "scheduling",
        text: "Keep Fridays light — no more than 3 meetings. He uses Fridays for deep work.",
        source: "manual",
        linkedRuleIds: ["rule-jw-sched-2"],
        updatedAt: "Feb 5, 2026",
        updatedBy: "Maria Lopez",
      },
      {
        id: "pref-jw-5",
        category: "scheduling",
        text: "Client meetings always take priority over internal meetings when conflicts arise",
        source: "manual",
        linkedRuleIds: ["rule-jw-sched-1"],
        updatedAt: "Feb 7, 2026",
        updatedBy: "Maria Lopez",
      },
      {
        id: "pref-jw-6",
        category: "communication",
        text: "Conversational, warm tone for emails — first name basis with most contacts. Sign off: 'Best, James'",
        source: "manual",
        linkedRuleIds: ["rule-jw-corr-1"],
        updatedAt: "Jan 30, 2026",
        updatedBy: "Maria Lopez",
      },
      {
        id: "pref-jw-7",
        category: "communication",
        text: "Follow-up reminders should be sent on Tuesday mornings — he believes Mondays are too busy for recipients",
        source: "learned",
        linkedRuleIds: ["rule-jw-corr-2"],
        updatedAt: "Feb 5, 2026",
        updatedBy: "System",
      },
      {
        id: "pref-jw-8",
        category: "expenses",
        text: "Prefers to batch expense submissions weekly on Fridays rather than ad hoc",
        source: "manual",
        linkedRuleIds: ["rule-jw-exp-1"],
        updatedAt: "Jan 25, 2026",
        updatedBy: "Maria Lopez",
      },
    ],
    vipContacts: [
      {
        name: "Patricia Whitfield",
        relationship: "Spouse",
        notes: "Contact for personal calendar matters. She manages family diary and school pick-up schedule.",
      },
      {
        name: "Alastair Henderson",
        relationship: "Key Client (Henderson Group CEO)",
        notes: "James's most important client relationship. Always prioritize his requests. Prefers phone calls over email.",
      },
      {
        name: "Sophie Martin",
        relationship: "Executive Assistant (London Office Manager)",
        notes: "Handles room bookings and visitor logistics at 30 St Mary Axe. Very helpful for last-minute London arrangements.",
      },
    ],
    recurringCommitments: [
      {
        title: "EMEA Partners Meeting",
        frequency: "Monthly (First Monday, 10 AM GMT)",
        notes: "Virtual. 90 min. Pre-read materials needed 48h prior.",
      },
      {
        title: "Henderson Group Check-in",
        frequency: "Bi-weekly (Thu 3 PM GMT)",
        notes: "James's highest-priority client meeting. Never reschedule from EA side.",
      },
      {
        title: "Friday Deep Work Block",
        frequency: "Weekly (Fri 9 AM – 12 PM)",
        notes: "Protected time for strategic thinking. No meetings unless James explicitly approves.",
      },
    ],
    escalationNotes:
      "Escalate immediately for: (1) anything from Henderson Group, (2) travel disruptions affecting same-day departures, (3) requests from the London Office Managing Partner. James is patient but dislikes surprises — always flag potential issues early even if unresolved. Use Teams for urgent, email for non-urgent.",
    deskNotes: [
      {
        id: "dn-jw-1",
        timestamp: "Feb 8, 2026 — 3:30 PM",
        author: "Maria Lopez",
        content:
          "James's coverage is now active. Key thing: he has a different rhythm than most partners — Fridays are sacred deep work time. Don't let anyone book over his Friday morning block without checking with him directly.",
        pinned: true,
      },
      {
        id: "dn-jw-2",
        timestamp: "Feb 6, 2026 — 11:00 AM",
        author: "Maria Lopez",
        content:
          "Modified the KPMG partnership response draft — James wanted a warmer tone and a specific reference to the dinner they had in Davos. He builds relationships through personal touches in correspondence.",
        pinned: false,
      },
      {
        id: "dn-jw-3",
        timestamp: "Feb 4, 2026 — 2:15 PM",
        author: "Maria Lopez",
        content:
          "Rescheduled vendor meeting to next week instead of just moving the time slot. James prefers to keep days thematically consistent — if a day is mostly client-facing, don't mix in vendor meetings.",
        pinned: false,
      },
      {
        id: "dn-jw-4",
        timestamp: "Jan 28, 2026 — 4:00 PM",
        author: "Maria Lopez",
        content:
          "James changed his seat preference from window to aisle on the LHR→CDG flight. He said he's been preferring aisle lately for longer flights. Updated the travel preference but keeping window for short hops.",
        pinned: false,
      },
    ],
    coverageHandoff:
      "James is London-based and operates on GMT. He's relationship-driven and values personal touches in communications. Key things: (1) Henderson Group is his top client — Alastair Henderson gets white-glove treatment, (2) Never book red-eye flights, (3) Fridays are deep work — protect the morning block, (4) He prefers warm, conversational email tone, (5) He batches expenses on Fridays, (6) For London logistics, Sophie Martin at 30 St Mary Axe is your contact. Maria Lopez has been his primary EA and knows his patterns well — reach out to her for anything unclear.",
    lastUpdated: "Feb 8, 2026",
    lastUpdatedBy: "Maria Lopez",
  },
]
