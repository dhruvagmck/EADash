import { Link } from "react-router-dom"
import type { SupervisionItem } from "@/data/types"
import ConditionChip from "@/components/shared/ConditionChip"
import { Info, ExternalLink } from "lucide-react"

interface ExplainabilityBlockProps {
  item: SupervisionItem
}

export default function ExplainabilityBlock({
  item,
}: ExplainabilityBlockProps) {
  return (
    <div className="rounded-lg border bg-muted p-4">
      <div className="mb-2 flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Why held
        </span>
        <span className="text-xs text-muted-foreground">·</span>
        <Link
          to="/authority"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {item.authorityTag}
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <p className="text-sm leading-relaxed text-foreground">
        {item.reasoning}
      </p>

      {item.preferences.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.preferences.map((pref) => (
            <ConditionChip key={pref} label={pref} />
          ))}
        </div>
      )}
    </div>
  )
}
