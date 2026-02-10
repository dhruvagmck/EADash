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
        <Info className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Why this was held
        </span>
      </div>

      {/* Authority rule reference — clickable link to Authority Editor */}
      <p className="mb-2 text-xs text-muted-foreground">
        Held by:{" "}
        <Link
          to="/authority"
          className="inline-flex items-center gap-1 font-medium text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {item.authorityTag}
          <ExternalLink className="h-3 w-3" />
        </Link>
      </p>

      <p className="text-sm leading-relaxed text-foreground">
        {item.reasoning}
      </p>

      {item.preferences.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Relevant preferences:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.preferences.map((pref) => (
              <ConditionChip key={pref} label={pref} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
