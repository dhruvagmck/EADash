import type { Partner, SwimlaneSummaryData } from "./types"

export const partners: Partner[] = [
  {
    id: "partner-1",
    name: "Sarah Chen",
    initials: "SC",
    role: "Associate Partner",
    location: "New York",
    coverageStatus: "active",
    colorAccent: "#6366f1",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "partner-2",
    name: "James Whitfield",
    initials: "JW",
    role: "Partner",
    location: "London",
    coverageStatus: "coverage",
    coverageName: "Maria Lopez",
    colorAccent: "#8b5cf6",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
]

export const swimlaneSummaries: SwimlaneSummaryData[] = [
  { partnerId: "partner-1", autoCount: 14, heldCount: 5, exceptionCount: 2 },
  { partnerId: "partner-2", autoCount: 9, heldCount: 4, exceptionCount: 1 },
]
