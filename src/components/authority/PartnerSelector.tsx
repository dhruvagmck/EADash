import { useState } from "react"
import type { Partner } from "@/data/types"
import type { AuthorityRule } from "@/data/types"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface PartnerSelectorProps {
  partners: Partner[]
  rules: AuthorityRule[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function PartnerSelector({
  partners,
  rules,
  selectedId,
  onSelect,
}: PartnerSelectorProps) {
  const [search, setSearch] = useState("")

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r pr-4">
      {/* Search/filter */}
      <div className="relative mb-3 shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search partners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-xs"
        />
      </div>

      <p className="mb-3 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Partners
      </p>

      {/* Scrollable partner list */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {filteredPartners.map((partner) => {
          const partnerRules = rules.filter((r) => r.partnerId === partner.id)
          const isSelected = partner.id === selectedId

          const lastDates = partnerRules
            .map((r) => r.lastTriggered)
            .filter(Boolean)
          const lastEditedText =
            lastDates.length > 0 ? `edited ${lastDates[0]}` : "no edits yet"

          return (
            <button
              key={partner.id}
              onClick={() => onSelect(partner.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
                isSelected
                  ? "border-border bg-muted shadow-sm"
                  : "border-transparent hover:bg-muted"
              )}
            >
              <PartnerAvatar partner={partner} showInfo />
              <div className="ml-2 shrink-0 text-right">
                <span className="block text-xs text-muted-foreground">
                  {partnerRules.length} rules
                </span>
                <span className="block text-[10px] text-muted-foreground/70">
                  {lastEditedText}
                </span>
              </div>
            </button>
          )
        })}

        {filteredPartners.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No partners match your search.
          </p>
        )}
      </div>
    </div>
  )
}
