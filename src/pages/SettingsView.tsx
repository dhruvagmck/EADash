import { useState, useCallback, useRef } from "react"
import PageHeader from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { partners } from "@/data/partners"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Bell,
  Clock,
  ArrowUpDown,
  Palette,
  Keyboard,
  Users,
  Shield,
  CalendarDays,
  CheckSquare,
  LineChart,
  Layers,
} from "lucide-react"

// ── Persisted settings ──

const STORAGE_KEY = "ea-hitl-settings"

interface PersistedSettings {
  notifications: Record<string, boolean>
  workingHours: { start: string; end: string; timezone: string }
  queueSort: string
  shortcutsEnabled: boolean
}

const DEFAULT_SETTINGS: PersistedSettings = {
  notifications: {
    "p1-exceptions": true,
    "all-exceptions": false,
    "stale-should": true,
    "coverage-gaps": false,
    "authority-suggestions": false,
  },
  workingHours: { start: "08:30", end: "18:00", timezone: "est" },
  queueSort: "time-sensitive",
  shortcutsEnabled: true,
}

function loadSettings(): PersistedSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: PersistedSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

// ── Component ──

const NOTIFICATION_OPTIONS = [
  { id: "p1-exceptions", label: "P1 exceptions" },
  { id: "all-exceptions", label: "All exceptions" },
  { id: "stale-should", label: "SHOULD items stale > 2 hours" },
  { id: "coverage-gaps", label: "Coverage gaps" },
  { id: "authority-suggestions", label: "Authority adjustment suggestions" },
]

const SHORTCUT_REFERENCE = [
  { key: "Enter", action: "Approve" },
  { key: "R", action: "Reject" },
  { key: "E", action: "Escalate" },
  { key: "N / P", action: "Next / Previous item" },
]

export default function SettingsView() {
  const [settings, setSettings] = useState<PersistedSettings>(loadSettings)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save with debounced toast
  const update = useCallback(
    (partial: Partial<PersistedSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial }
        saveSettings(next)
        return next
      })
      // Debounce the "saved" toast
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => {
        toast.success("Settings saved")
      }, 800)
    },
    []
  )

  const toggleNotification = (id: string) => {
    update({
      notifications: {
        ...settings.notifications,
        [id]: !settings.notifications[id],
      },
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        subtitle="Preferences, notifications, and admin tools"
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-5 p-6">
          {/* ─── EA Personal Settings ─── */}
          <h2 className="text-base font-semibold">EA Personal Settings</h2>

          {/* Notification Preferences */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Notifications</h3>
            </div>
            <div className="space-y-3">
              {NOTIFICATION_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <Checkbox
                    checked={settings.notifications[opt.id] ?? false}
                    onCheckedChange={() => toggleNotification(opt.id)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Working Hours */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Working Hours</h3>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start</label>
                <Input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) =>
                    update({
                      workingHours: {
                        ...settings.workingHours,
                        start: e.target.value,
                      },
                    })
                  }
                  className="w-32"
                />
              </div>
              <span className="mb-2 text-muted-foreground">—</span>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End</label>
                <Input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) =>
                    update({
                      workingHours: {
                        ...settings.workingHours,
                        end: e.target.value,
                      },
                    })
                  }
                  className="w-32"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Timezone
                </label>
                <Select
                  value={settings.workingHours.timezone}
                  onValueChange={(val) =>
                    update({
                      workingHours: {
                        ...settings.workingHours,
                        timezone: val,
                      },
                    })
                  }
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern (EST)</SelectItem>
                    <SelectItem value="cst">Central (CST)</SelectItem>
                    <SelectItem value="pst">Pacific (PST)</SelectItem>
                    <SelectItem value="gmt">GMT (London)</SelectItem>
                    <SelectItem value="cet">CET (Paris)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Queue Sorting + Shortcuts side by side */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Queue Sorting</h3>
              </div>
              <Select
                value={settings.queueSort}
                onValueChange={(val) => update({ queueSort: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time-sensitive">
                    Time-sensitive first
                  </SelectItem>
                  <SelectItem value="by-partner">By Partner</SelectItem>
                  <SelectItem value="by-domain">By Domain</SelectItem>
                  <SelectItem value="by-confidence">
                    By confidence score
                  </SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Shortcuts</h3>
                </div>
                <Switch
                  checked={settings.shortcutsEnabled}
                  onCheckedChange={(val) =>
                    update({ shortcutsEnabled: val })
                  }
                />
              </div>
              <div
                className={cn(
                  "space-y-1.5 transition-opacity",
                  !settings.shortcutsEnabled && "opacity-40"
                )}
              >
                {SHORTCUT_REFERENCE.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between text-xs"
                  >
                    <kbd className="rounded bg-muted px-2 py-0.5 font-mono text-[11px]">
                      {s.key}
                    </kbd>
                    <span className="text-muted-foreground">{s.action}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Partner Colors */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Partner Colors</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <div
                    className="h-5 w-5 rounded-full border"
                    style={{ backgroundColor: p.colorAccent }}
                  />
                  <span className="text-sm">{p.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.colorAccent}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Separator />

          {/* ─── EA Manager Admin Panel ─── */}
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">EA Manager Admin</h2>
            <Badge variant="secondary" className="text-[10px]">
              Coming soon
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 opacity-50 lg:grid-cols-3">
            {[
              { icon: Users, label: "Team Dashboard", stat: "3 EAs active" },
              {
                icon: Shield,
                label: "Authority Templates",
                stat: "2 templates",
              },
              {
                icon: CalendarDays,
                label: "Coverage Matrix",
                stat: "0 gaps",
              },
              {
                icon: CheckSquare,
                label: "Quality Review",
                stat: "5 pending",
              },
              {
                icon: LineChart,
                label: "Service Analytics",
                stat: "SLA 97.2%",
              },
              { icon: Layers, label: "Bulk Updates", stat: "12 days ago" },
            ].map(({ icon: Icon, label, stat }) => (
              <Card
                key={label}
                className="cursor-not-allowed p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{label}</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{stat}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
