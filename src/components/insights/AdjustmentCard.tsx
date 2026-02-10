import type { AuthorityAdjustment } from "@/data/types"
import AuthorityToggle from "@/components/shared/AuthorityToggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface AdjustmentCardProps {
  adjustment: AuthorityAdjustment
  onDismiss?: (id: string) => void
}

export default function AdjustmentCard({
  adjustment,
  onDismiss,
}: AdjustmentCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-sm font-semibold leading-snug">
          {adjustment.title}
        </h3>

        {/* Authority change visual */}
        <div className="flex items-center gap-3">
          <AuthorityToggle level={adjustment.currentLevel} />
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <AuthorityToggle level={adjustment.suggestedLevel} />
        </div>

        {/* Evidence + Risk in compact layout */}
        <div className="rounded-md bg-muted p-3 text-sm">
          <p>{adjustment.evidence}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {adjustment.implication}
          </p>
        </div>

        {adjustment.riskNote && (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {adjustment.riskNote}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      </div>
    </Card>
  )
}
