import { useState, useRef, useEffect, useCallback } from "react"
import type {
  StructuredPreferences,
  PartnerPreference,
  PreferenceCategory,
  TravelPreferences,
  SchedulingPreferences,
  CommunicationPreferences,
  ExpensePreferences,
} from "@/data/types"
import PreferenceCard from "./PreferenceCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Plane,
  Calendar,
  MessageSquare,
  Receipt,
  ChevronDown,
  Plus,
  Sparkles,
  Pencil,
  Clock,
  ShieldCheck,
  X,
} from "lucide-react"

// ═══════════════════════════════════════════════════════
// Inline Editing Primitives
// ═══════════════════════════════════════════════════════

/** Click-to-edit select dropdown */
function EditableSelect({
  value,
  options,
  displayMap,
  onSave,
}: {
  value: string
  options: string[]
  displayMap: Record<string, string>
  onSave: (v: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editing) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setEditing(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [editing])

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group/edit inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        {displayMap[value] || value || <span className="italic text-muted-foreground">Not set</span>}
        <Pencil className="h-2.5 w-2.5 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
      </button>
    )
  }

  return (
    <div ref={ref} className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            onSave(opt)
            setEditing(false)
          }}
          className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
            opt === value
              ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
              : "border-transparent bg-muted/50 text-foreground hover:bg-muted"
          }`}
        >
          {displayMap[opt] || opt}
        </button>
      ))}
    </div>
  )
}

/** Click-to-edit text input */
function EditableText({
  value,
  onSave,
  placeholder,
  prefix,
}: {
  value: string
  onSave: (v: string) => void
  placeholder?: string
  prefix?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(value)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [editing, value])

  const save = useCallback(() => {
    onSave(draft.trim())
    setEditing(false)
  }, [draft, onSave])

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group/edit inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        {value ? (
          <span>{prefix}{value}</span>
        ) : (
          <span className="italic text-muted-foreground">{placeholder || "Not set"}</span>
        )}
        <Pencil className="h-2.5 w-2.5 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save()
          if (e.key === "Escape") setEditing(false)
        }}
        onBlur={save}
        className="h-7 w-32 text-xs"
        placeholder={placeholder}
      />
    </div>
  )
}

/** Click-to-edit number input */
function EditableNumber({
  value,
  onSave,
  placeholder,
  prefix,
  suffix,
}: {
  value: number | null
  onSave: (v: number | null) => void
  placeholder?: string
  prefix?: string
  suffix?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value !== null ? String(value) : "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(value !== null ? String(value) : "")
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [editing, value])

  const save = useCallback(() => {
    const num = parseFloat(draft)
    onSave(isNaN(num) ? null : num)
    setEditing(false)
  }, [draft, onSave])

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group/edit inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        {value !== null ? (
          <span>{prefix}{value.toLocaleString()}{suffix}</span>
        ) : (
          <span className="italic text-muted-foreground">{placeholder || "Not set"}</span>
        )}
        <Pencil className="h-2.5 w-2.5 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
      <Input
        ref={inputRef}
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save()
          if (e.key === "Escape") setEditing(false)
        }}
        onBlur={save}
        className="h-7 w-24 text-xs"
        placeholder={placeholder}
      />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  )
}

/** Click-to-edit chip list (add/remove tags) */
function EditableChips({
  items,
  onSave,
  color = "default",
  placeholder,
}: {
  items: string[]
  onSave: (items: string[]) => void
  color?: "default" | "red"
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [newItem, setNewItem] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editing) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [editing])

  useEffect(() => {
    if (editing) setTimeout(() => inputRef.current?.focus(), 0)
  }, [editing])

  const addItem = useCallback(() => {
    const v = newItem.trim()
    if (v && !items.includes(v)) {
      onSave([...items, v])
    }
    setNewItem("")
  }, [newItem, items, onSave])

  const removeItem = useCallback(
    (item: string) => {
      onSave(items.filter((i) => i !== item))
    },
    [items, onSave]
  )

  const chipStyle =
    color === "red"
      ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
      : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400"

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group/edit inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-muted"
      >
        {items.length === 0 ? (
          <span className="text-xs italic text-muted-foreground">
            {placeholder || "None set"}
          </span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${chipStyle}`}
              >
                {item}
              </span>
            ))}
          </div>
        )}
        <Pencil className="h-2.5 w-2.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
      </button>
    )
  }

  return (
    <div ref={containerRef} className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`inline-flex items-center gap-1 rounded-full py-0.5 pl-2.5 pr-1 text-xs font-medium ${chipStyle}`}
          >
            {item}
            <button
              onClick={() => removeItem(item)}
              className="rounded-full p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addItem()
            }
            if (e.key === "Escape") setEditing(false)
          }}
          placeholder="Add..."
          className="h-7 w-32 text-xs"
        />
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={addItem}
          disabled={!newItem.trim()}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-[10px] text-muted-foreground"
          onClick={() => setEditing(false)}
        >
          Done
        </Button>
      </div>
    </div>
  )
}

/** Click-to-edit toggle for two-state values */
function EditableToggle({
  value,
  onLabel,
  offLabel,
  onSave,
  dangerWhenOn,
}: {
  value: boolean
  onLabel: string
  offLabel: string
  onSave: (v: boolean) => void
  dangerWhenOn?: boolean
}) {
  return (
    <button
      onClick={() => onSave(!value)}
      className="group/edit inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted"
    >
      {value ? (
        <span className={`flex items-center gap-1 ${dangerWhenOn ? "text-red-600 dark:text-red-400" : ""}`}>
          <ShieldCheck className="h-3 w-3" />
          {onLabel}
        </span>
      ) : (
        <span>{offLabel}</span>
      )}
      <Pencil className="h-2.5 w-2.5 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
    </button>
  )
}

/** Click-to-edit multi-select for days of the week */
function EditableDayPicker({
  selected,
  onSave,
}: {
  selected: string[]
  onSave: (days: string[]) => void
}) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  useEffect(() => {
    if (!editing) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setEditing(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [editing])

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group/edit inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-muted"
      >
        {selected.length === 0 ? (
          <span className="text-xs italic text-muted-foreground">None set</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selected.map((d) => (
              <span
                key={d}
                className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400"
              >
                {d}
              </span>
            ))}
          </div>
        )}
        <Pencil className="h-2.5 w-2.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
      </button>
    )
  }

  return (
    <div ref={ref} className="flex flex-wrap gap-1">
      {DAYS.map((day) => {
        const active = selected.includes(day)
        return (
          <button
            key={day}
            onClick={() => {
              onSave(
                active
                  ? selected.filter((d) => d !== day)
                  : [...selected, day]
              )
            }}
            className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
              active
                ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                : "border-transparent bg-muted/50 text-foreground hover:bg-muted"
            }`}
          >
            {day.slice(0, 3)}
          </button>
        )
      })}
      <button
        onClick={() => setEditing(false)}
        className="rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted"
      >
        Done
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// Layout primitives
// ═══════════════════════════════════════════════════════

function SourceBadge({ source }: { source: string }) {
  if (source === "learned") {
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
        <Sparkles className="h-2.5 w-2.5" />
        Learned
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 text-[10px] font-normal">
      <Pencil className="h-2.5 w-2.5" />
      Manual
    </Badge>
  )
}

function FieldRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center justify-end">{children}</div>
    </div>
  )
}

interface DomainSectionProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  count: number
  defaultOpen?: boolean
  children: React.ReactNode
}

function DomainSection({
  icon: Icon,
  label,
  count,
  defaultOpen = false,
  children,
}: DomainSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-sm font-semibold">{label}</span>
        {count > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {count} note{count !== 1 ? "s" : ""}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-1 rounded-lg border bg-card/50 p-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ═══════════════════════════════════════════════════════
// Option maps
// ═══════════════════════════════════════════════════════

const SEAT_OPTIONS = ["window", "middle", "aisle"]
const SEAT_LABELS: Record<string, string> = { window: "Window", middle: "Middle", aisle: "Aisle", "": "Not set" }
const CABIN_OPTIONS = ["economy", "premium-economy", "business", "first"]
const CABIN_LABELS: Record<string, string> = { economy: "Economy", "premium-economy": "Premium Economy", business: "Business", first: "First", "": "Not set" }
const TONE_OPTIONS = ["formal", "conversational", "neutral"]
const TONE_LABELS: Record<string, string> = { formal: "Formal", conversational: "Conversational", neutral: "Neutral" }
const CHANNEL_OPTIONS = ["Teams", "Email", "Slack"]
const CHANNEL_LABELS: Record<string, string> = { Teams: "Teams", Email: "Email", Slack: "Slack" }
const CADENCE_OPTIONS = ["ad-hoc", "weekly", "bi-weekly", "monthly"]
const CADENCE_LABELS: Record<string, string> = { "ad-hoc": "Ad hoc", weekly: "Weekly", "bi-weekly": "Bi-weekly", monthly: "Monthly" }
const DAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const DAY_LABELS: Record<string, string> = Object.fromEntries(DAY_OPTIONS.map((d) => [d, d]))
const RECEIPT_OPTIONS = ["minimal", "standard", "detailed"]
const RECEIPT_LABELS: Record<string, string> = { minimal: "Minimal", standard: "Standard", detailed: "Detailed (attendee names)" }

const TZ_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
]
const TZ_LABELS: Record<string, string> = {
  "America/New_York": "ET (Eastern)",
  "America/Chicago": "CT (Central)",
  "America/Denver": "MT (Mountain)",
  "America/Los_Angeles": "PT (Pacific)",
  "Europe/London": "GMT (London)",
  "Europe/Paris": "CET (Paris)",
  "Asia/Tokyo": "JST (Tokyo)",
  "Asia/Singapore": "SGT (Singapore)",
}

// ═══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════

interface StructuredPreferenceSectionProps {
  structured: StructuredPreferences
  freeTextPreferences: PartnerPreference[]
  onAddPreference: (pref: PartnerPreference) => void
  onUpdateStructured: (patch: Partial<{
    travel: Partial<TravelPreferences>
    scheduling: Partial<SchedulingPreferences>
    communication: Partial<CommunicationPreferences>
    expenses: Partial<ExpensePreferences>
  }>) => void
}

export default function StructuredPreferenceSection({
  structured,
  freeTextPreferences,
  onAddPreference,
  onUpdateStructured,
}: StructuredPreferenceSectionProps) {
  const travel = structured.travel
  const sched = structured.scheduling
  const comm = structured.communication
  const exp = structured.expenses

  const travelNotes = freeTextPreferences.filter((p) => p.category === "travel")
  const schedNotes = freeTextPreferences.filter((p) => p.category === "scheduling")
  const commNotes = freeTextPreferences.filter((p) => p.category === "communication")
  const expNotes = freeTextPreferences.filter((p) => p.category === "expenses")
  const tsNotes = freeTextPreferences.filter((p) => p.category === "timesheets")
  const generalNotes = freeTextPreferences.filter((p) => p.category === "general")

  return (
    <div className="space-y-3">
      {/* ── Travel ── */}
      <DomainSection icon={Plane} label="Travel" count={travelNotes.length} defaultOpen>
        <div className="divide-y">
          <FieldRow label="Seat (short-haul)">
            <EditableSelect
              value={travel.seatShortHaul}
              options={SEAT_OPTIONS}
              displayMap={SEAT_LABELS}
              onSave={(v) => onUpdateStructured({ travel: { seatShortHaul: v as any } })}
            />
          </FieldRow>
          <FieldRow label="Seat (long-haul)">
            <EditableSelect
              value={travel.seatLongHaul}
              options={SEAT_OPTIONS}
              displayMap={SEAT_LABELS}
              onSave={(v) => onUpdateStructured({ travel: { seatLongHaul: v as any } })}
            />
          </FieldRow>
          <FieldRow label="Cabin (domestic)">
            <EditableSelect
              value={travel.cabinDomestic}
              options={CABIN_OPTIONS}
              displayMap={CABIN_LABELS}
              onSave={(v) => onUpdateStructured({ travel: { cabinDomestic: v as any } })}
            />
          </FieldRow>
          <FieldRow label="Cabin (international)">
            <EditableSelect
              value={travel.cabinInternational}
              options={CABIN_OPTIONS}
              displayMap={CABIN_LABELS}
              onSave={(v) => onUpdateStructured({ travel: { cabinInternational: v as any } })}
            />
          </FieldRow>
          <FieldRow label="Preferred airlines">
            <EditableChips
              items={travel.preferredAirlines}
              onSave={(v) => onUpdateStructured({ travel: { preferredAirlines: v } })}
            />
          </FieldRow>
          <FieldRow label="Avoid airlines">
            <EditableChips
              items={travel.avoidAirlines}
              color="red"
              onSave={(v) => onUpdateStructured({ travel: { avoidAirlines: v } })}
              placeholder="None (click to add)"
            />
          </FieldRow>
          <FieldRow label="Preferred hotels">
            <EditableChips
              items={travel.preferredHotels}
              onSave={(v) => onUpdateStructured({ travel: { preferredHotels: v } })}
            />
          </FieldRow>
          <FieldRow label="Avoid hotels">
            <EditableChips
              items={travel.avoidHotels}
              color="red"
              onSave={(v) => onUpdateStructured({ travel: { avoidHotels: v } })}
              placeholder="None (click to add)"
            />
          </FieldRow>
          <FieldRow label="Red-eye flights">
            <EditableToggle
              value={travel.redEyePolicy === "never"}
              onLabel="Never"
              offLabel="Allowed"
              dangerWhenOn
              onSave={(never) =>
                onUpdateStructured({ travel: { redEyePolicy: never ? "never" : "allow" } })
              }
            />
          </FieldRow>
        </div>
        <AdditionalNotes notes={travelNotes} category="travel" onAdd={onAddPreference} />
      </DomainSection>

      {/* ── Scheduling ── */}
      <DomainSection icon={Calendar} label="Scheduling" count={schedNotes.length} defaultOpen>
        <div className="divide-y">
          <FieldRow label="Meeting window">
            <div className="flex items-center gap-1 text-xs">
              <EditableText
                value={sched.earliestMeeting}
                onSave={(v) => onUpdateStructured({ scheduling: { earliestMeeting: v } })}
                placeholder="09:00"
              />
              <span className="text-muted-foreground">–</span>
              <EditableText
                value={sched.latestMeeting}
                onSave={(v) => onUpdateStructured({ scheduling: { latestMeeting: v } })}
                placeholder="17:30"
              />
            </div>
          </FieldRow>
          <FieldRow label="Timezone">
            <EditableSelect
              value={sched.timezone}
              options={TZ_OPTIONS}
              displayMap={TZ_LABELS}
              onSave={(v) => onUpdateStructured({ scheduling: { timezone: v } })}
            />
          </FieldRow>
          <FieldRow label="Max meetings/day">
            <EditableNumber
              value={sched.maxMeetingsPerDay}
              onSave={(v) => onUpdateStructured({ scheduling: { maxMeetingsPerDay: v } })}
              placeholder="No limit"
            />
          </FieldRow>
          <FieldRow label="Light day(s)">
            <EditableDayPicker
              selected={sched.lightDays}
              onSave={(v) => onUpdateStructured({ scheduling: { lightDays: v } })}
            />
          </FieldRow>
        </div>

        {/* Protected blocks */}
        {sched.protectedBlocks.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Protected Time Blocks
            </p>
            <div className="space-y-1.5">
              {sched.protectedBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
                >
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="flex-1 text-xs font-medium">
                    {block.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {block.days.join(", ")} {block.startTime}–{block.endTime}
                  </span>
                  <SourceBadge source={block.source} />
                </div>
              ))}
            </div>
          </div>
        )}

        <AdditionalNotes notes={schedNotes} category="scheduling" onAdd={onAddPreference} />
      </DomainSection>

      {/* ── Communication ── */}
      <DomainSection icon={MessageSquare} label="Communication" count={commNotes.length}>
        <div className="divide-y">
          <FieldRow label="Default tone">
            <EditableSelect
              value={comm.defaultTone}
              options={TONE_OPTIONS}
              displayMap={TONE_LABELS}
              onSave={(v) => onUpdateStructured({ communication: { defaultTone: v as any } })}
            />
          </FieldRow>
          <FieldRow label="Sign-off">
            <EditableText
              value={comm.defaultSignOff}
              onSave={(v) => onUpdateStructured({ communication: { defaultSignOff: v } })}
              prefix={"\u201C"}
            />
          </FieldRow>
          <FieldRow label="Internal channel">
            <EditableSelect
              value={comm.internalChannel}
              options={CHANNEL_OPTIONS}
              displayMap={CHANNEL_LABELS}
              onSave={(v) => onUpdateStructured({ communication: { internalChannel: v } })}
            />
          </FieldRow>
        </div>
        <AdditionalNotes notes={commNotes} category="communication" onAdd={onAddPreference} />
      </DomainSection>

      {/* ── Expenses ── */}
      <DomainSection icon={Receipt} label="Expenses" count={expNotes.length}>
        <div className="divide-y">
          <FieldRow label="Submission cadence">
            <EditableSelect
              value={exp.submissionCadence}
              options={CADENCE_OPTIONS}
              displayMap={CADENCE_LABELS}
              onSave={(v) => onUpdateStructured({ expenses: { submissionCadence: v } })}
            />
          </FieldRow>
          <FieldRow label="Preferred day">
            <EditableSelect
              value={exp.preferredSubmissionDay}
              options={DAY_OPTIONS}
              displayMap={DAY_LABELS}
              onSave={(v) => onUpdateStructured({ expenses: { preferredSubmissionDay: v } })}
            />
          </FieldRow>
          <FieldRow label="Receipt detail">
            <EditableSelect
              value={exp.receiptDetailLevel}
              options={RECEIPT_OPTIONS}
              displayMap={RECEIPT_LABELS}
              onSave={(v) => onUpdateStructured({ expenses: { receiptDetailLevel: v } })}
            />
          </FieldRow>
          <FieldRow label="Default categories">
            <EditableChips
              items={exp.defaultCategories}
              onSave={(v) => onUpdateStructured({ expenses: { defaultCategories: v } })}
            />
          </FieldRow>
          <FieldRow label="Approval threshold">
            <EditableNumber
              value={exp.approvalThreshold}
              onSave={(v) => onUpdateStructured({ expenses: { approvalThreshold: v } })}
              prefix="$"
              placeholder="Not set"
            />
          </FieldRow>
        </div>
        <AdditionalNotes notes={expNotes} category="expenses" onAdd={onAddPreference} />
      </DomainSection>

      {/* ── Timesheet notes (if any) ── */}
      {tsNotes.length > 0 && (
        <DomainSection icon={Clock} label="Timesheet Notes" count={tsNotes.length}>
          <AdditionalNotes notes={tsNotes} category="timesheets" onAdd={onAddPreference} />
        </DomainSection>
      )}

      {/* ── General notes (if any) ── */}
      {generalNotes.length > 0 && (
        <DomainSection icon={Pencil} label="General" count={generalNotes.length}>
          <AdditionalNotes notes={generalNotes} category="general" onAdd={onAddPreference} />
        </DomainSection>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// Additional Notes sub-component
// ═══════════════════════════════════════════════════════

function AdditionalNotes({
  notes,
  category,
  onAdd,
}: {
  notes: PartnerPreference[]
  category: PreferenceCategory
  onAdd: (pref: PartnerPreference) => void
}) {
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState("")

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd({
      id: `pref-new-${Date.now()}`,
      category,
      text: text.trim(),
      source: "manual",
      linkedRuleIds: [],
      updatedAt: "Just now",
      updatedBy: "You",
    })
    setText("")
    setAdding(false)
  }

  return (
    <div className="mt-3 border-t pt-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Additional Notes
      </p>
      {notes.length > 0 ? (
        <div className="space-y-1.5">
          {notes.map((pref) => (
            <PreferenceCard key={pref.id} preference={pref} />
          ))}
        </div>
      ) : (
        !adding && (
          <p className="text-xs italic text-muted-foreground">
            No additional notes
          </p>
        )
      )}

      {adding ? (
        <div className="mt-2 space-y-2 rounded-lg border border-dashed p-3">
          <Input
            placeholder="Add a note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="h-8 text-xs"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs">
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAdding(false)
                setText("")
              }}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-7 gap-1 text-xs text-muted-foreground"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-3 w-3" />
          Add Note
        </Button>
      )}
    </div>
  )
}
