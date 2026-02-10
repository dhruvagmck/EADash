import type { PredictionMetadata } from "@/data/types"
import { TrendingUp, Clock, Database } from "lucide-react"

interface PredictionBasisProps {
  prediction: PredictionMetadata
}

export default function PredictionBasis({ prediction }: PredictionBasisProps) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900 dark:bg-indigo-950/30">
      <div className="mb-2 flex items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-1 font-medium text-indigo-700 dark:text-indigo-300">
          <TrendingUp className="h-3 w-3" />
          {prediction.basis}
        </span>
        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
          <Clock className="h-3 w-3" />
          {prediction.timeHorizon}
        </span>
      </div>

      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
          <Database className="h-3 w-3 shrink-0" />
          Evidence signals
        </p>
        <ul className="space-y-0.5 pl-4.5">
          {prediction.dataPoints.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-[11px] leading-relaxed text-indigo-700/80 dark:text-indigo-300/80"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
