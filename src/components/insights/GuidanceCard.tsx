import type { ProactiveGuidance } from "@/data/types"
import { partners } from "@/data/partners"
import PartnerAvatar from "@/components/shared/PartnerAvatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Clock,
  MapPin,
  Plane,
  BookOpen,
  UserCheck,
} from "lucide-react"

const typeIcons = {
  recovery_buffer: Clock,
  colocation: MapPin,
  logistics: Plane,
  preference_learning: BookOpen,
  relationship_nudge: UserCheck,
}

const typeLabels = {
  recovery_buffer: "Recovery Buffer",
  colocation: "Co-location",
  logistics: "Logistics Optimization",
  preference_learning: "Preference Learning",
  relationship_nudge: "Relationship Nudge",
}

const typeBorder = {
  recovery_buffer: "border-l-blue-500",
  colocation: "border-l-violet-500",
  logistics: "border-l-cyan-500",
  preference_learning: "border-l-emerald-500",
  relationship_nudge: "border-l-rose-500",
}

interface GuidanceCardProps {
  guidance: ProactiveGuidance
  onDismiss?: (id: string) => void
  onAction?: (id: string, actionLabel: string) => void
}

export default function GuidanceCard({
  guidance,
  onDismiss,
  onAction,
}: GuidanceCardProps) {
  const partner = partners.find((p) => p.id === guidance.partnerId)
  const Icon = typeIcons[guidance.type]

  const handleAction = (label: string) => {
    if (label.toLowerCase() === "dismiss") {
      onDismiss?.(guidance.id)
    } else {
      onAction?.(guidance.id, label)
    }
  }

  return (
    <Card className={`border-l-4 p-4 ${typeBorder[guidance.type]}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {typeLabels[guidance.type]}
            </span>
            {partner && <PartnerAvatar partner={partner} size="sm" />}
          </div>
          <h4 className="mt-1.5 text-sm font-semibold">{guidance.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {guidance.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {guidance.actions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={
                  action.variant === "primary"
                    ? "default"
                    : action.variant === "secondary"
                      ? "outline"
                      : "ghost"
                }
                className={
                  action.variant === "ghost" ? "text-muted-foreground" : ""
                }
                onClick={() => handleAction(action.label)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
