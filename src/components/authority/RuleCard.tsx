import { useState } from "react"
import type { AuthorityRule, AuthorityLevel } from "@/data/types"
import AuthorityToggle from "@/components/shared/AuthorityToggle"
import ConditionChip from "@/components/shared/ConditionChip"
import OverrideHistory from "./OverrideHistory"
import SuggestedAdjustment from "./SuggestedAdjustment"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock, Zap, Heart, ChevronDown, ChevronUp } from "lucide-react"
import { useDashboardState } from "@/store/DashboardProvider"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


interface RuleCardProps {
  rule: AuthorityRule
  onLevelChange?: (ruleId: string, level: AuthorityLevel) => void
}

export default function RuleCard({ rule, onLevelChange }: RuleCardProps) {
  const { partnerProfiles } = useDashboardState()
  const navigate = useNavigate()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [suggestionDismissed, setSuggestionDismissed] = useState(false)

  // Find preferences linked to this rule
  const profile = partnerProfiles.find((p) => p.partnerId === rule.partnerId)
  const linkedPrefs = profile
    ? profile.preferences.filter((pref) =>
        pref.linkedRuleIds.includes(rule.id)
      )
    : []

  const hasDetails =
    rule.overrideHistory.length > 0 || rule.triggerCount30d > 0

  return (
    <Card className="gap-0 p-4">
      <div className="flex items-start gap-4">
        {/* Authority Toggle */}
        <AuthorityToggle
          level={rule.level}
          onChange={
            onLevelChange ? (level) => onLevelChange(rule.id, level) : undefined
          }
        />

        {/* Rule Content */}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium">{rule.actionDescription}</p>

          {/* Source Preference Annotation */}
          {linkedPrefs.length > 0 && (
            <button
              onClick={() => navigate("/preferences")}
              className="flex items-start gap-1.5 rounded-md border border-indigo-100 bg-indigo-50/50 px-2.5 py-1.5 text-left transition-colors hover:bg-indigo-100/70 dark:border-indigo-900 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50"
            >
              <Heart className="mt-0.5 h-3 w-3 shrink-0 text-indigo-500" />
              <div className="min-w-0">
                {linkedPrefs.map((pref) => (
                  <p
                    key={pref.id}
                    className="text-[11px] leading-snug text-indigo-700 dark:text-indigo-300"
                  >
                    {pref.text}
                  </p>
                ))}
              </div>
            </button>
          )}

          {/* Condition Chips */}
          {rule.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {rule.conditions.map((c) => (
                <ConditionChip key={c} label={c} />
              ))}
            </div>
          )}

          {/* Compact stats line + expand toggle */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {rule.triggerCount30d}x / 30d
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {rule.lastTriggered}
            </span>
            {hasDetails && (
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {detailsOpen ? "Less" : "Details"}
                {detailsOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
          </div>

          {/* Collapsible details */}
          {detailsOpen && (
            <div className="space-y-2 border-t pt-2">
              {/* Escalation Override */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Escalation:
                </span>
                <Select defaultValue={rule.escalationBehavior}>
                  <SelectTrigger className="h-7 w-56 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hold for review">
                      Hold for review
                    </SelectItem>
                    <SelectItem value="Hold and notify via Teams">
                      Hold and notify via Teams
                    </SelectItem>
                    <SelectItem value="Hold and notify via email">
                      Hold and notify via email
                    </SelectItem>
                    <SelectItem value="Block silently">
                      Block silently
                    </SelectItem>
                    <SelectItem value="Block and notify EA">
                      Block and notify EA
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Override History */}
              <OverrideHistory entries={rule.overrideHistory} />
            </div>
          )}

          {/* Suggested Adjustment — always visible unless dismissed */}
          {rule.suggestedAdjustment && !suggestionDismissed && (
            <SuggestedAdjustment
              suggestion={rule.suggestedAdjustment}
              onAccept={() => {
                // Suggestion text contains "upgrading to CAN" — promote to CAN
                if (onLevelChange) {
                  onLevelChange(rule.id, "CAN")
                }
                setSuggestionDismissed(true)
                toast.success("Adjustment accepted", {
                  description: `Rule upgraded to CAN: "${rule.actionDescription}"`,
                })
              }}
              onDismiss={() => {
                setSuggestionDismissed(true)
                toast.info("Suggestion dismissed", {
                  description: `Keeping current level for "${rule.actionDescription}"`,
                })
              }}
            />
          )}
        </div>
      </div>
    </Card>
  )
}
