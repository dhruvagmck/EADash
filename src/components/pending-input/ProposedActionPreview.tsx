import type { PendingInputItem } from "@/data/types"
import { Card } from "@/components/ui/card"
import { Mail, Plane, Calendar, Receipt } from "lucide-react"

interface ProposedActionPreviewProps {
  item: PendingInputItem
}

const typeIcons = {
  email_draft: Mail,
  booking: Plane,
  scheduling: Calendar,
  expense: Receipt,
}

const typeLabels = {
  email_draft: "Email Draft",
  booking: "Booking",
  scheduling: "Schedule Change",
  expense: "Expense",
}

export default function ProposedActionPreview({
  item,
}: ProposedActionPreviewProps) {
  const Icon = typeIcons[item.proposedAction.type]

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b bg-muted px-4 py-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {typeLabels[item.proposedAction.type]}
        </span>
      </div>

      {/* Preview content */}
      <div className="p-4">
        {/* Email-specific fields */}
        {item.proposedAction.type === "email_draft" && (
          <div className="mb-3 space-y-0.5 text-xs text-muted-foreground">
            {item.proposedAction.to && (
              <p>
                <span className="font-medium">To:</span> {item.proposedAction.to}
              </p>
            )}
            {item.proposedAction.subject && (
              <p>
                <span className="font-medium">Subject:</span>{" "}
                {item.proposedAction.subject}
              </p>
            )}
          </div>
        )}

        {/* Preview text */}
        <div className="whitespace-pre-wrap rounded-md border bg-card p-3 text-sm leading-relaxed">
          {item.proposedAction.preview}
        </div>
      </div>
    </Card>
  )
}
