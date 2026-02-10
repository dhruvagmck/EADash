import { useState, useEffect, useCallback } from "react"
import PageHeader from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
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
  { key: "N", action: "Next item" },
  { key: "P", action: "Previous item" },
  { key: "F", action: "Focus mode toggle" },
]

export default function SettingsView() {
  const [settings, setSettings] = useState<PersistedSettings>(loadSettings)

  // Auto-save on change
  const update = useCallback(
    (partial: Partial<PersistedSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial }
        saveSettings(next)
        return next
      })
    },
    []
  )

  // Show saved indicator on first load (optional)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      // Settings loaded from previous session — no toast needed
    }
  }, [])

  const toggleNotification = (id: string) => {
    update({
      notifications: {
        ...settings.notifications,
        [id]: !settings.notifications[id],
      },
    })
    toast.success("Setting saved")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        subtitle="Personal preferences, notification config, and admin tools"
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* ─── EA Personal Settings ─── */}
          <h2 className="text-base font-semibold">EA Personal Settings</h2>

          {/* Notification Preferences */}
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">
                Notification Preferences
              </h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Control which events trigger Teams bot notifications.
            </p>
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
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Working Hours</h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Items arriving outside these hours are queued and surfaced at start
              of next working day.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start</label>
                <Input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => {
                    update({
                      workingHours: {
                        ...settings.workingHours,
                        start: e.target.value,
                      },
                    })
                    toast.success("Setting saved")
                  }}
                  className="w-32"
                />
              </div>
              <span className="mb-2 text-muted-foreground">—</span>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End</label>
                <Input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => {
                    update({
                      workingHours: {
                        ...settings.workingHours,
                        end: e.target.value,
                      },
                    })
                    toast.success("Setting saved")
                  }}
                  className="w-32"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Timezone
                </label>
                <Select
                  value={settings.workingHours.timezone}
                  onValueChange={(val) => {
                    update({
                      workingHours: {
                        ...settings.workingHours,
                        timezone: val,
                      },
                    })
                    toast.success("Setting saved")
                  }}
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

          {/* Queue Sorting */}
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">
                Default Queue Sorting
              </h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Default sort order for the Supervision Queue.
            </p>
            <Select
              value={settings.queueSort}
              onValueChange={(val) => {
                update({ queueSort: val })
                toast.success("Setting saved")
              }}
            >
              <SelectTrigger className="w-64">
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

          {/* Partner Colors */}
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Partner Colors</h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Customize the color-coding used in swimlane borders and queue
              items.
            </p>
            <div className="space-y-3">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: p.colorAccent }}
                  />
                  <span className="w-36 text-sm font-medium">{p.name}</span>
                  <Input
                    type="color"
                    defaultValue={p.colorAccent}
                    className="h-8 w-16 cursor-pointer p-0.5"
                  />
                  <span className="text-xs text-muted-foreground">
                    {p.colorAccent}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {settings.shortcutsEnabled ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  checked={settings.shortcutsEnabled}
                  onCheckedChange={(val) => {
                    update({ shortcutsEnabled: val })
                    toast.success(
                      val ? "Shortcuts enabled" : "Shortcuts disabled"
                    )
                  }}
                />
              </div>
            </div>
            <div
              className={cn(
                "rounded-md border transition-opacity",
                !settings.shortcutsEnabled && "opacity-50"
              )}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                      Key
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SHORTCUT_REFERENCE.map((s) => (
                    <tr key={s.key} className="border-b last:border-b-0">
                      <td className="px-4 py-2">
                        <kbd className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                          {s.key}
                        </kbd>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {s.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Separator />

          {/* ─── EA Manager Admin Panel ─── */}
          <h2 className="text-base font-semibold">EA Manager Admin</h2>
          <p className="text-sm text-muted-foreground">
            Accessible to users with the EA Manager role.
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Team Dashboard */}
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Team Dashboard</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Overview of all EAs: active/offline status, current focus mode,
                queue depth, exception count. Sortable by workload.
              </p>
              <div className="mt-3 rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
                3 EAs active · 1 offline · 14 items pending
              </div>
            </Card>

            {/* Authority Templates */}
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">
                  Authority Templates
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Create, edit, and publish authority rule templates. Assign as
                defaults for new Partner-EA pairings.
              </p>
              <div className="mt-3 rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
                2 templates · 89% adoption rate
              </div>
            </Card>

            {/* Coverage Matrix */}
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Coverage Matrix</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Partners x Dates grid showing assigned EA + backup. Gaps
                highlighted in red. Drag-drop to assign.
              </p>
              <div className="mt-3 rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
                0 coverage gaps this week
              </div>
            </Card>

            {/* Quality Review */}
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Quality Review</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Random sample of resolved items for quality audit. Score
                decisions and leave feedback.
              </p>
              <div className="mt-3 rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
                5 items pending review
              </div>
            </Card>

            {/* Service Analytics */}
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <LineChart className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Service Analytics</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Portfolio-wide SLA performance, automation rates, override
                trends, exception volumes.
              </p>
              <div className="mt-3 rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
                SLA: 97.2% · Automation: 68%
              </div>
            </Card>

            {/* Bulk Authority Updates */}
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">
                  Bulk Authority Updates
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Apply rule changes across multiple Partners. Preview and
                confirmation before applying.
              </p>
              <div className="mt-3 rounded-md bg-muted p-3 text-center text-xs text-muted-foreground">
                Last bulk update: 12 days ago
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
