import { useState, useCallback, useRef, useMemo } from "react"
import PageHeader from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
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
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  NOTIFICATION_OPTIONS,
  SHORTCUT_REFERENCE,
  DOMAIN_LABELS,
  type PersistedSettings,
} from "@/lib/settings"
import type { Domain } from "@/data/types"
import { useDashboardState } from "@/store/DashboardProvider"
import {
  Bell,
  Clock,
  ArrowUpDown,
  Palette,
  Keyboard,
  User,
  Bot,
  Send,
  Download,
  RotateCcw,
  Upload,
  Shield,
  Gauge,
  Sparkles,
  AlertTriangle,
  Mail,
} from "lucide-react"

// ── Predefined color palette ──

const COLOR_PALETTE = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#ef4444", "#f97316",
  "#eab308", "#84cc16", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#2563eb", "#7c3aed",
]

// ── Component ──

export default function SettingsView() {
  const [settings, setSettings] = useState<PersistedSettings>(loadSettings)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dashboardState = useDashboardState()

  // Derive effective partner colors (setting overrides or data defaults)
  const effectiveColors = useMemo(() => {
    const colors: Record<string, string> = {}
    for (const p of partners) {
      colors[p.id] = settings.partnerColors[p.id] || p.colorAccent
    }
    return colors
  }, [settings.partnerColors])

  // Auto-save with debounced toast
  const update = useCallback(
    (partial: Partial<PersistedSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial }
        saveSettings(next)
        return next
      })
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

  const updateProfile = (field: string, value: string) => {
    update({ profile: { ...settings.profile, [field]: value } })
  }

  const updateDelivery = (field: string, value: unknown) => {
    update({ delivery: { ...settings.delivery, [field]: value } })
  }

  const updateAI = (field: string, value: unknown) => {
    update({ ai: { ...settings.ai, [field]: value } })
  }

  const toggleDomainOverride = (domain: Domain) => {
    const current = settings.ai.domainOverrides[domain]
    if (current) {
      const next = { ...settings.ai.domainOverrides }
      delete next[domain]
      update({ ai: { ...settings.ai, domainOverrides: next } })
    } else {
      update({
        ai: {
          ...settings.ai,
          domainOverrides: {
            ...settings.ai.domainOverrides,
            [domain]: { autoApprove: false },
          },
        },
      })
    }
  }

  const setDomainAutoApprove = (domain: Domain, autoApprove: boolean) => {
    update({
      ai: {
        ...settings.ai,
        domainOverrides: {
          ...settings.ai.domainOverrides,
          [domain]: {
            ...settings.ai.domainOverrides[domain],
            autoApprove,
          },
        },
      },
    })
  }

  const setPartnerColor = (partnerId: string, color: string) => {
    update({ partnerColors: { ...settings.partnerColors, [partnerId]: color } })
  }

  // Export settings / data
  const handleExportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ea-cockpit-settings.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Settings exported")
  }

  const handleExportAuthorityRules = () => {
    // Export authority-relevant data from dashboard state
    const data = {
      exportedAt: new Date().toISOString(),
      partnerProfiles: dashboardState.partnerProfiles.map((p) => ({
        partnerId: p.partnerId,
        preferences: p.structuredPreferences,
        escalationNotes: p.escalationNotes,
      })),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ea-cockpit-authority-export.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Authority data exported")
  }

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as Partial<PersistedSettings>
        const merged: PersistedSettings = {
          ...DEFAULT_SETTINGS,
          ...imported,
          profile: { ...DEFAULT_SETTINGS.profile, ...(imported.profile || {}) },
          delivery: { ...DEFAULT_SETTINGS.delivery, ...(imported.delivery || {}) },
          ai: {
            ...DEFAULT_SETTINGS.ai,
            ...(imported.ai || {}),
            domainOverrides: {
              ...DEFAULT_SETTINGS.ai.domainOverrides,
              ...((imported.ai || {}).domainOverrides || {}),
            },
          },
        }
        saveSettings(merged)
        setSettings(merged)
        toast.success("Settings imported successfully")
      } catch {
        toast.error("Invalid settings file")
      }
    }
    reader.readAsText(file)
    e.target.value = "" // reset so same file can be re-imported
  }

  const handleResetDefaults = () => {
    saveSettings(DEFAULT_SETTINGS)
    setSettings(DEFAULT_SETTINGS)
    toast.success("Settings reset to defaults")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        subtitle="Profile, notifications, AI behavior, and data management"
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-5 p-6">

          {/* ════════════════════════════════════════════
              SECTION 1: User Profile
              ════════════════════════════════════════════ */}
          <h2 className="text-base font-semibold">Your Profile</h2>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Profile Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Display Name</label>
                <Input
                  value={settings.profile.name}
                  onChange={(e) => updateProfile("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <Input
                  value={settings.profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Role / Title</label>
                <Input
                  value={settings.profile.role}
                  onChange={(e) => updateProfile("role", e.target.value)}
                  placeholder="Executive Assistant"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Assigned partners: {partners.map((p) => p.name).join(", ")}
            </p>
          </Card>

          <Separator />

          {/* ════════════════════════════════════════════
              SECTION 2: Notifications & Delivery
              ════════════════════════════════════════════ */}
          <h2 className="text-base font-semibold">Notifications</h2>

          {/* What to notify about */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Notification Categories</h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Choose which events generate notifications and drive sidebar badges.
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

          {/* How to deliver notifications */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Send className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Delivery Channels</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">In-app toasts</p>
                  <p className="text-xs text-muted-foreground">Show toast notifications in the bottom-right</p>
                </div>
                <Switch
                  checked={settings.delivery.inAppToasts}
                  onCheckedChange={(val) => updateDelivery("inAppToasts", val)}
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Browser push notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified even when the tab is in background</p>
                </div>
                <Switch
                  checked={settings.delivery.browserPush}
                  onCheckedChange={(val) => updateDelivery("browserPush", val)}
                />
              </label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email digest
                  </p>
                  <p className="text-xs text-muted-foreground">Receive a summary email at a set cadence</p>
                </div>
                <Select
                  value={settings.delivery.emailDigest}
                  onValueChange={(val) => updateDelivery("emailDigest", val)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Quiet hours</p>
                    <p className="text-xs text-muted-foreground">Suppress all notifications during these hours</p>
                  </div>
                  <Switch
                    checked={settings.delivery.quietHoursEnabled}
                    onCheckedChange={(val) => updateDelivery("quietHoursEnabled", val)}
                  />
                </label>
                {settings.delivery.quietHoursEnabled && (
                  <div className="mt-3 flex items-end gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">From</label>
                      <Input
                        type="time"
                        value={settings.delivery.quietStart}
                        onChange={(e) => updateDelivery("quietStart", e.target.value)}
                        className="w-28"
                      />
                    </div>
                    <span className="mb-2 text-muted-foreground">—</span>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">To</label>
                      <Input
                        type="time"
                        value={settings.delivery.quietEnd}
                        onChange={(e) => updateDelivery("quietEnd", e.target.value)}
                        className="w-28"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Separator />

          {/* ════════════════════════════════════════════
              SECTION 3: AI Autonomy & Behavior
              ════════════════════════════════════════════ */}
          <h2 className="text-base font-semibold">AI Autonomy & Behavior</h2>

          {/* Auto-approve threshold */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Auto-approve Threshold</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              SHOULD items with a confidence score above this threshold will be highlighted for quick batch approval.
              Higher values mean more items require manual review.
            </p>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.ai.autoApproveThreshold * 100]}
                onValueChange={([val]) => updateAI("autoApproveThreshold", val / 100)}
                min={50}
                max={99}
                step={1}
                className="flex-1"
              />
              <Badge variant="secondary" className="min-w-[3.5rem] justify-center font-mono text-xs">
                {Math.round(settings.ai.autoApproveThreshold * 100)}%
              </Badge>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>More autonomous</span>
              <span>More cautious</span>
            </div>
          </Card>

          {/* Escalation + Suggestion frequency side by side */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Escalation Behavior</h3>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                How CANNOT and edge-case items are handled.
              </p>
              <Select
                value={settings.ai.escalationMode}
                onValueChange={(val) => updateAI("escalationMode", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hold-for-review">Hold for review</SelectItem>
                  <SelectItem value="auto">Auto-escalate to Partner</SelectItem>
                  <SelectItem value="immediate">Immediate notification</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Suggestion Frequency</h3>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                How actively the AI surfaces suggestions.
              </p>
              <Select
                value={settings.ai.suggestionFrequency}
                onValueChange={(val) => updateAI("suggestionFrequency", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative — fewer, high-confidence only</SelectItem>
                  <SelectItem value="balanced">Balanced — default</SelectItem>
                  <SelectItem value="aggressive">Aggressive — surface more suggestions</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>

          {/* Domain overrides */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Domain-Level Overrides</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Override AI auto-approve behavior per domain. When disabled, the global threshold above applies.
            </p>
            <div className="space-y-3">
              {(Object.keys(DOMAIN_LABELS) as Domain[]).map((domain) => {
                const override = settings.ai.domainOverrides[domain]
                return (
                  <div key={domain} className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={!!override}
                        onCheckedChange={() => toggleDomainOverride(domain)}
                      />
                      <span className="text-sm">{DOMAIN_LABELS[domain]}</span>
                    </div>
                    {override && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Auto-approve:</span>
                        <Switch
                          checked={override.autoApprove}
                          onCheckedChange={(val) => setDomainAutoApprove(domain, val)}
                        />
                        <Badge
                          variant={override.autoApprove ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {override.autoApprove ? "On" : "Off"}
                        </Badge>
                      </div>
                    )}
                    {!override && (
                      <span className="text-xs text-muted-foreground">Using global threshold</span>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          <Separator />

          {/* ════════════════════════════════════════════
              SECTION 4: Queue & Shortcuts
              ════════════════════════════════════════════ */}
          <h2 className="text-base font-semibold">Queue & Workflow</h2>

          {/* Working Hours */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Working Hours</h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Items arriving outside these hours will be flagged on the At a Glance page.
            </p>
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
              <p className="mb-3 text-xs text-muted-foreground">
                Default sort order for the Pending Input queue.
              </p>
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
                  <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
                </div>
                <Switch
                  checked={settings.shortcutsEnabled}
                  onCheckedChange={(val) =>
                    update({ shortcutsEnabled: val })
                  }
                />
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Hotkeys for the Pending Input queue.
              </p>
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

          <Separator />

          {/* ════════════════════════════════════════════
              SECTION 5: Partner Colors
              ════════════════════════════════════════════ */}
          <h2 className="text-base font-semibold">Appearance</h2>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Partner Colors</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Customize accent colors for each partner across the dashboard.
            </p>
            <div className="space-y-4">
              {partners.map((p) => {
                const activeColor = effectiveColors[p.id]
                return (
                  <div key={p.id} className="flex items-center gap-4">
                    <div
                      className="h-8 w-8 shrink-0 rounded-full border-2"
                      style={{ backgroundColor: activeColor, borderColor: activeColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{activeColor}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                            activeColor === color
                              ? "border-foreground ring-2 ring-foreground/20 scale-110"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setPartnerColor(p.id, color)}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Separator />

          {/* ════════════════════════════════════════════
              SECTION 6: Data & Export
              ════════════════════════════════════════════ */}
          <h2 className="text-base font-semibold">Data & Export</h2>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Manage Settings</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Export, import, or reset your configuration. Useful for onboarding a new EA or syncing across devices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={handleExportSettings}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Import Settings
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportSettings}
              />
              <Button variant="outline" size="sm" onClick={handleExportAuthorityRules}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export Authority Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDefaults}
                className="text-destructive hover:text-destructive"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset to Defaults
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
