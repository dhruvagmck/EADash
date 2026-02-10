import {
  Calendar,
  Plane,
  Mail,
  Clock,
  Briefcase,
  Shield,
  Eye,
  Zap,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Users,
} from "lucide-react"
import type { DomainConfig, Domain, NavItem } from "@/data/types"

export const DOMAIN_CONFIG: Record<Domain, DomainConfig> = {
  "client-facing": { label: "Client-Facing", icon: Briefcase, color: "#6366f1" },
  "internal-scheduling": { label: "Internal Scheduling", icon: Calendar, color: "#3b82f6" },
  "travel-expenses": { label: "Travel & Expenses", icon: Plane, color: "#8b5cf6" },
  timesheets: { label: "Timesheets", icon: Clock, color: "#f59e0b" },
  "email-triage": { label: "Email Triage", icon: Mail, color: "#06b6d4" },
}

export const SEVERITY_STYLES = {
  urgent: { bg: "bg-red-50 dark:bg-red-950", border: "border-red-500", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  review: { bg: "bg-amber-50 dark:bg-amber-950", border: "border-amber-500", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  running: { bg: "bg-green-50 dark:bg-green-950", border: "border-green-500", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  clear: { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-300 dark:border-slate-700", text: "text-slate-500 dark:text-slate-400", dot: "bg-slate-300 dark:bg-slate-600" },
} as const

export const AUTHORITY_STYLES = {
  CAN: { bg: "bg-green-100 dark:bg-green-950", text: "text-green-800 dark:text-green-300", border: "border-green-400 dark:border-green-700", activeBg: "bg-green-600", activeText: "text-white" },
  SHOULD: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-800 dark:text-amber-300", border: "border-amber-400 dark:border-amber-700", activeBg: "bg-amber-500", activeText: "text-white" },
  CANNOT: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-800 dark:text-red-300", border: "border-red-400 dark:border-red-700", activeBg: "bg-red-600", activeText: "text-white" },
} as const

export const EXCEPTION_SEVERITY_STYLES = {
  P1: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-800 dark:text-red-300", border: "border-red-500" },
  P2: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-800 dark:text-amber-300", border: "border-amber-500" },
  P3: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-800 dark:text-blue-300", border: "border-blue-500" },
} as const

export const CONFIDENCE_STYLES = {
  Recommended: { bg: "bg-green-100 dark:bg-green-950", text: "text-green-800 dark:text-green-300" },
  Viable: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-800 dark:text-blue-300" },
  Risky: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-800 dark:text-red-300" },
} as const

export const NAV_ITEMS: NavItem[] = [
  { path: "/portfolio", label: "At a Glance", icon: LayoutDashboard, badge: 0 },
  { path: "/partners", label: "Preferences", icon: Users, badge: 0 },
  { path: "/authority", label: "Authority", icon: Shield, badge: 0 },
  { path: "/supervision", label: "Pending Input", icon: Eye, badge: 0 },
  { path: "/exceptions", label: "Decisions", icon: Zap, badge: 0 },
  { path: "/insights", label: "AI Suggestions", icon: Lightbulb, badge: 0 },
  { path: "/settings", label: "Settings", icon: Settings, badge: 0 },
]

export const DOMAINS: Domain[] = [
  "client-facing",
  "internal-scheduling",
  "travel-expenses",
  "timesheets",
  "email-triage",
]
