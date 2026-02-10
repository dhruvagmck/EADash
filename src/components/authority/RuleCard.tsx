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
import { Clock, Zap, Heart } from "lucide-react"
import { useDashboardState } from "@/store/DashboardContext"
import { useNavigate } from "react-router-dom"

interface RuleCardProps {
  rule: AuthorityRule
  onLevelChange?: (ruleId: string, level: AuthorityLevel) => void
}

export default function RuleCard({ rule, onLevelChange }: RuleCardProps) {
  const { partnerProfiles } = useDashboardState()
  const navigate = useNavigate()

  // Find preferences linked to this rule
  const profile = partnerProfiles.find((p) => p.partnerId === rule.partnerId)
  const linkedPrefs = profile
    ? profile.preferences.filter((pref) =>
        pref.linkedRuleIds.includes(rule.id)
      )
    : []

  return (
    <Card className="gap-0 p-4">
      <div className="flex items-start gap-4">
        {/* Authority Toggle — now interactive */}
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
              onClick={() => navigate("/partners")}
              className="flex items-start gap-1.5 rounded-md border border-indigo-100 bg-indigo-50/50 px-2.5 py-1.5 text-left transition-colors hover:bg-indigo-100/70 dark:border-indigo-900 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50"
            >
              <Heart className="mt-0.5 h-3 w-3 shrink-0 text-indigo-500" />
              <div className="min-w-0">
                {linkedPrefs.map((pref) => (
                  <p key={pref.id} className="text-[11px] leading-snug text-indigo-700 dark:text-indigo-300">
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

          {/* Escalation Override — now a dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Escalation:</span>
            <Select defaultValue={rule.escalationBehavior}>
              <SelectTrigger className="h-7 w-56 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hold for review">Hold for review</SelectItem>
                <SelectItem value="Hold and notify via Teams">
                  Hold and notify via Teams
                </SelectItem>
                <SelectItem value="Hold and notify via email">
                  Hold and notify via email
                </SelectItem>
                <SelectItem value="Block silently">Block silently</SelectItem>
                <SelectItem value="Block and notify EA">
                  Block and notify EA
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last triggered: {rule.lastTriggered}
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {rule.triggerCount30d}x in 30d
            </span>
          </div>

          {/* Override History */}
          <OverrideHistory entries={rule.overrideHistory} />

          {/* Suggested Adjustment */}
          {rule.suggestedAdjustment && (
            <SuggestedAdjustment suggestion={rule.suggestedAdjustment} />
          )}
        </div>
      </div>
    </Card>
  )
}
