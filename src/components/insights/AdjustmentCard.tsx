import type { AuthorityAdjustment } from "@/data/types"
import AuthorityToggle from "@/components/shared/AuthorityToggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Shield } from "lucide-react"

interface AdjustmentCardProps {
  adjustment: AuthorityAdjustment
  onDismiss?: (id: string) => void
}

export default function AdjustmentCard({
  adjustment,
  onDismiss,
}: AdjustmentCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title */}
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />
            <h3 className="text-sm font-semibold leading-snug">
              {adjustment.title}
            </h3>
          </div>

          {/* Authority change visual */}
          <div className="flex items-center gap-3 pl-8">
            <AuthorityToggle level={adjustment.currentLevel} />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <AuthorityToggle level={adjustment.suggestedLevel} />
          </div>

          {/* Evidence */}
          <div className="rounded-md bg-muted p-3 pl-8">
            <p className="text-xs font-medium text-muted-foreground">
              Evidence
            </p>
            <p className="mt-1 text-sm">{adjustment.evidence}</p>
          </div>

          {/* Implication */}
          <div className="pl-8">
            <p className="text-xs font-medium text-muted-foreground">
              Implication
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {adjustment.implication}
            </p>
          </div>

          {/* Risk note */}
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 pl-8 dark:border-amber-800 dark:bg-amber-950">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Risk Note
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
              {adjustment.riskNote}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pl-8">
        {adjustment.suggestedLevel !== adjustment.currentLevel && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onDismiss?.(adjustment.id)}
          >
            Upgrade to {adjustment.suggestedLevel}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDismiss?.(adjustment.id)}
        >
          Add condition & upgrade
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => onDismiss?.(adjustment.id)}
        >
          Dismiss
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => onDismiss?.(adjustment.id)}
        >
          Snooze 30 days
        </Button>
      </div>
    </Card>
  )
}
