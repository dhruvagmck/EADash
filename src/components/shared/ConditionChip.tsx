import { cn } from "@/lib/utils"

interface ConditionChipProps {
  label: string
  className?: string
}

export default function ConditionChip({ label, className }: ConditionChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground",
        className
      )}
    >
      {label}
    </span>
  )
}
