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
import { Clock, Zap } from "lucide-react"

interface RuleCardProps {
  rule: AuthorityRule
  onLevelChange?: (ruleId: string, level: AuthorityLevel) => void
}

export default function RuleCard({ rule, onLevelChange }: RuleCardProps) {
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
