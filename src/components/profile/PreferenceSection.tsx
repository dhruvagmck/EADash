import { useState } from "react"
import type { PartnerPreference, PreferenceCategory } from "@/data/types"
import PreferenceCard from "./PreferenceCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Plane, Calendar, MessageSquare, Receipt, FileText } from "lucide-react"

const CATEGORY_CONFIG: Record<
  PreferenceCategory,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  travel: { label: "Travel", icon: Plane },
  scheduling: { label: "Scheduling", icon: Calendar },
  communication: { label: "Communication", icon: MessageSquare },
  expenses: { label: "Expenses", icon: Receipt },
  general: { label: "General", icon: FileText },
}

const CATEGORIES: PreferenceCategory[] = [
  "travel",
  "scheduling",
  "communication",
  "expenses",
  "general",
]

interface PreferenceSectionProps {
  preferences: PartnerPreference[]
  onAdd: (preference: PartnerPreference) => void
}

export default function PreferenceSection({
  preferences,
  onAdd,
}: PreferenceSectionProps) {
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState("")
  const [newCategory, setNewCategory] = useState<PreferenceCategory>("general")

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: preferences.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0)

  const handleAdd = () => {
    if (!newText.trim()) return
    const pref: PartnerPreference = {
      id: `pref-new-${Date.now()}`,
      category: newCategory,
      text: newText.trim(),
      source: "manual",
      linkedRuleIds: [],
      updatedAt: "Just now",
      updatedBy: "You",
    }
    onAdd(pref)
    setNewText("")
    setAdding(false)
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ category, items }) => {
        const config = CATEGORY_CONFIG[category]
        const Icon = config.icon
        return (
          <div key={category}>
            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">{config.label}</h3>
              <span className="text-xs text-muted-foreground">
                ({items.length})
              </span>
            </div>
            <div className="space-y-2">
              {items.map((pref) => (
                <PreferenceCard key={pref.id} preference={pref} />
              ))}
            </div>
          </div>
        )
      })}

      {/* Add Preference */}
      {adding ? (
        <div className="space-y-2 rounded-lg border border-dashed p-3">
          <div className="flex gap-2">
            <Select
              value={newCategory}
              onValueChange={(v) => setNewCategory(v as PreferenceCategory)}
            >
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_CONFIG[cat].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter preference..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="h-8 flex-1 text-xs"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs">
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAdding(false)
                setNewText("")
              }}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full gap-2 border-dashed text-muted-foreground hover:text-foreground"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-4 w-4" />
          Add Preference
        </Button>
      )}
    </div>
  )
}
