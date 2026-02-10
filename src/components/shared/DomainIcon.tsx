import { DOMAIN_CONFIG } from "@/lib/constants"
import type { Domain } from "@/data/types"
import { cn } from "@/lib/utils"

interface DomainIconProps {
  domain: Domain
  size?: number
  className?: string
  showLabel?: boolean
}

export default function DomainIcon({
  domain,
  size = 18,
  className,
  showLabel = false,
}: DomainIconProps) {
  const config = DOMAIN_CONFIG[domain]
  const Icon = config.icon

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Icon
        className="shrink-0"
        style={{ width: size, height: size, color: config.color }}
      />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{config.label}</span>
      )}
    </span>
  )
}
