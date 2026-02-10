import type { PartnerPreference } from "@/data/types"
import LinkedRuleBadge from "./LinkedRuleBadge"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Pencil } from "lucide-react"

interface PreferenceCardProps {
  preference: PartnerPreference
}

export default function PreferenceCard({ preference }: PreferenceCardProps) {
  return (
    <div className="group flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50">
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-sm leading-snug">{preference.text}</p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Source badge */}
          {preference.source === "learned" ? (
            <Badge
              variant="secondary"
              className="gap-1 text-[10px] font-normal"
            >
              <Sparkles className="h-2.5 w-2.5" />
              Learned
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 text-[10px] font-normal"
            >
              <Pencil className="h-2.5 w-2.5" />
              Manual
            </Badge>
          )}

          {/* Linked authority rules */}
          {preference.linkedRuleIds.map((ruleId) => (
            <LinkedRuleBadge key={ruleId} ruleId={ruleId} />
          ))}

          {preference.linkedRuleIds.length === 0 && (
            <span className="text-[10px] italic text-muted-foreground">
              No automation rule linked
            </span>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Updated {preference.updatedAt} by {preference.updatedBy}
        </p>
      </div>
    </div>
  )
}
