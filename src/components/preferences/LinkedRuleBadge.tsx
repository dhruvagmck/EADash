import { useNavigate } from "react-router-dom"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface LinkedRuleBadgeProps {
  ruleId: string
  label?: string
  className?: string
}

export default function LinkedRuleBadge({
  ruleId,
  label,
  className,
}: LinkedRuleBadgeProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate("/authority")}
      title={`Authority rule: ${ruleId}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900",
        className
      )}
    >
      <Shield className="h-2.5 w-2.5" />
      {label || ruleId}
    </button>
  )
}
