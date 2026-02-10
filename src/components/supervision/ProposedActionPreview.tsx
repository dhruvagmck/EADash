import type { SupervisionItem } from "@/data/types"
import { Card } from "@/components/ui/card"
import { Mail, Plane, Calendar, Receipt } from "lucide-react"

interface ProposedActionPreviewProps {
  item: SupervisionItem
}

const typeIcons = {
  email_draft: Mail,
  booking: Plane,
  scheduling: Calendar,
  expense: Receipt,
}

export default function ProposedActionPreview({
  item,
}: ProposedActionPreviewProps) {
  const Icon = typeIcons[item.proposedAction.type]

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b bg-muted px-4 py-2.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Proposed Action
        </span>
      </div>

      {/* Preview content */}
      <div className="p-4">
        {/* Email-specific fields */}
        {item.proposedAction.type === "email_draft" && (
          <div className="mb-3 space-y-1 text-xs text-muted-foreground">
            {item.proposedAction.to && (
              <p>
                <span className="font-medium">To:</span> {item.proposedAction.to}
              </p>
            )}
            {item.proposedAction.from && (
              <p>
                <span className="font-medium">From:</span>{" "}
                {item.proposedAction.from}
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
