import { useState } from "react"
import { AlertTriangle, X, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

type BannerVariant = "warning" | "error" | "info"

interface StaleBannerProps {
  variant?: BannerVariant
  message: string
  detail?: string
  dismissible?: boolean
  className?: string
}

const VARIANT_STYLES: Record<
  BannerVariant,
  { bg: string; text: string; icon: typeof AlertTriangle }
> = {
  warning: {
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-300",
    icon: AlertTriangle,
  },
  error: {
    bg: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    text: "text-red-800 dark:text-red-300",
    icon: WifiOff,
  },
  info: {
    bg: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-300",
    icon: AlertTriangle,
  },
}

export default function StaleBanner({
  variant = "warning",
  message,
  detail,
  dismissible = true,
  className,
}: StaleBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const style = VARIANT_STYLES[variant]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between border-b px-6 py-2.5",
        style.bg,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4 shrink-0", style.text)} />
        <span className={cn("text-xs font-medium", style.text)}>{message}</span>
        {detail && (
          <span className={cn("text-xs opacity-70", style.text)}>{detail}</span>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className={cn("rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5")}
        >
          <X className={cn("h-3.5 w-3.5", style.text)} />
        </button>
      )}
    </div>
  )
}
