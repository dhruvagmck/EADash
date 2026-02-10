import type { Domain } from "@/data/types"

// ── Settings Types ──

export interface UserProfile {
  name: string
  email: string
  role: string
}

export interface NotificationDelivery {
  inAppToasts: boolean
  browserPush: boolean
  emailDigest: "off" | "realtime" | "hourly" | "daily"
  quietHoursEnabled: boolean
  quietStart: string
  quietEnd: string
}

export interface AIAutonomySettings {
  autoApproveThreshold: number // 0.0 – 1.0
  escalationMode: "auto" | "hold-for-review" | "immediate"
  suggestionFrequency: "conservative" | "balanced" | "aggressive"
  domainOverrides: Partial<Record<Domain, {
    autoApprove: boolean
    threshold?: number
  }>>
}

export interface PersistedSettings {
  // User profile
  profile: UserProfile
  // Notification categories
  notifications: Record<string, boolean>
  // Notification delivery
  delivery: NotificationDelivery
  // Working hours
  workingHours: { start: string; end: string; timezone: string }
  // Queue
  queueSort: string
  // Shortcuts
  shortcutsEnabled: boolean
  // Partner colors (partnerId → hex)
  partnerColors: Record<string, string>
  // AI autonomy
  ai: AIAutonomySettings
}

// ── Defaults ──

export const STORAGE_KEY = "ea-hitl-settings"

export const DEFAULT_SETTINGS: PersistedSettings = {
  profile: {
    name: "Alex Kim",
    email: "alex.kim@firm.com",
    role: "Executive Assistant",
  },
  notifications: {
    "p1-decisions": true,
    "all-decisions": false,
    "stale-should": true,
    "coverage-gaps": false,
    "authority-suggestions": false,
  },
  delivery: {
    inAppToasts: true,
    browserPush: false,
    emailDigest: "off",
    quietHoursEnabled: false,
    quietStart: "20:00",
    quietEnd: "08:00",
  },
  workingHours: { start: "08:30", end: "18:00", timezone: "est" },
  queueSort: "time-sensitive",
  shortcutsEnabled: true,
  partnerColors: {},
  ai: {
    autoApproveThreshold: 0.85,
    escalationMode: "hold-for-review",
    suggestionFrequency: "balanced",
    domainOverrides: {},
  },
}

// ── Persistence ──

export function loadSettings(): PersistedSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) },
        delivery: { ...DEFAULT_SETTINGS.delivery, ...(parsed.delivery || {}) },
        ai: {
          ...DEFAULT_SETTINGS.ai,
          ...(parsed.ai || {}),
          domainOverrides: {
            ...DEFAULT_SETTINGS.ai.domainOverrides,
            ...((parsed.ai || {}).domainOverrides || {}),
          },
        },
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS
}

export function saveSettings(settings: PersistedSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

// ── Notification option labels ──

export const NOTIFICATION_OPTIONS = [
  { id: "p1-decisions", label: "P1 decisions" },
  { id: "all-decisions", label: "All decisions" },
  { id: "stale-should", label: "SHOULD items stale > 2 hours" },
  { id: "coverage-gaps", label: "Coverage gaps" },
  { id: "authority-suggestions", label: "Authority adjustment suggestions" },
]

// ── Shortcut reference ──

export const SHORTCUT_REFERENCE = [
  { key: "Enter", action: "Approve" },
  { key: "R", action: "Reject" },
  { key: "E", action: "Escalate" },
  { key: "N / P", action: "Next / Previous item" },
]

// ── Domain labels for AI overrides ──

export const DOMAIN_LABELS: Record<Domain, string> = {
  "client-facing": "Client-Facing",
  "internal-scheduling": "Internal Scheduling",
  "travel-expenses": "Travel & Expenses",
  timesheets: "Timesheets",
  "email-triage": "Email Triage",
}
