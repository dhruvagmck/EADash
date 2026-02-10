import { useState, useMemo, useEffect, useCallback } from "react"
import PageHeader from "@/components/layout/PageHeader"
import ExceptionCard from "@/components/exceptions/ExceptionCard"
import PartnerFilterBar from "@/components/shared/PartnerFilterBar"
import { useDashboardState, useDashboardActions } from "@/store/DashboardContext"
import { partners } from "@/data/partners"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckCircle, Undo2, TrendingUp, Zap } from "lucide-react"

interface ResolutionBanner {
  exceptionId: string
  exceptionTitle: string
  timestamp: number
}

export default function ExceptionsView() {
  const { exceptionItems: exceptions, predictedExceptions: predictions } = useDashboardState()
  const { resolveException, undoResolveException, dismissPrediction, prestagePrediction } = useDashboardActions()
  const [banner, setBanner] = useState<ResolutionBanner | null>(null)
  const [undoTimer, setUndoTimer] = useState(60)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null)

  // Partner counts across both active and predicted
  const allItems = useMemo(() => [...predictions, ...exceptions], [predictions, exceptions])

  const partnerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of allItems) {
      counts[item.partnerId] = (counts[item.partnerId] || 0) + 1
    }
    return counts
  }, [allItems])

  const filteredPredictions = useMemo(
    () =>
      selectedPartnerId
        ? predictions.filter((e) => e.partnerId === selectedPartnerId)
        : predictions,
    [predictions, selectedPartnerId]
  )

  const filteredExceptions = useMemo(
    () =>
      selectedPartnerId
        ? exceptions.filter((e) => e.partnerId === selectedPartnerId)
        : exceptions,
    [exceptions, selectedPartnerId]
  )

  // Count down the undo timer
  useEffect(() => {
    if (!banner) return
    const interval = setInterval(() => {
      setUndoTimer((t) => {
        if (t <= 1) {
          setBanner(null)
          return 60
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [banner])

  const handleResolve = useCallback(
    (exceptionId: string, _optionId: string, _note: string) => {
      const exception = exceptions.find((e) => e.id === exceptionId)
      if (!exception) return

      resolveException(exceptionId)
      setBanner({
        exceptionId,
        exceptionTitle: exception.title,
        timestamp: Date.now(),
      })
      setUndoTimer(60)
      toast.success("Exception resolved", {
        description: exception.title,
      })
    },
    [exceptions, resolveException]
  )

  const handleUndo = useCallback(() => {
    if (!banner) return
    undoResolveException(banner.exceptionId)
    toast.info("Resolution undone", {
      description: banner.exceptionTitle,
    })
    setBanner(null)
  }, [banner, undoResolveException])

  const totalCount = allItems.length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Decisions"
        subtitle="Situations requiring your judgment — including AI-predicted risks"
      />

      {/* Partner filter bar */}
      <PartnerFilterBar
        partners={partners}
        selectedPartnerId={selectedPartnerId}
        onSelectPartner={setSelectedPartnerId}
        partnerCounts={partnerCounts}
        totalCount={totalCount}
      />

      {/* Resolution confirmation banner */}
      {banner && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-green-50 px-6 py-3 dark:bg-green-950">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-800 dark:text-green-300">
              Exception resolved. Downstream actions triggered.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-xs text-green-600 dark:text-green-400">
              Undo available for {undoTimer}s
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleUndo}
              className="gap-1.5 text-xs text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900"
            >
              <Undo2 className="h-3 w-3" />
              Undo
            </Button>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-5 p-6">

          {/* ── Predicted Risks Section ── */}
          {filteredPredictions.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Predicted Risks
                </h2>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
                  {filteredPredictions.length} predicted
                </span>
                <p className="ml-2 text-xs text-muted-foreground">
                  AI-detected risks before they happen — pre-stage a response or monitor
                </p>
              </div>

              {filteredPredictions.map((prediction) => (
                <ExceptionCard
                  key={prediction.id}
                  exception={prediction}
                  onDismissPrediction={dismissPrediction}
                  onPrestagePrediction={prestagePrediction}
                />
              ))}

              {/* Divider between sections */}
              {filteredExceptions.length > 0 && (
                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-border" />
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    Active Exceptions
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </>
          )}

          {/* ── Active Exceptions Section ── */}
          {filteredExceptions.map((exception) => (
            <ExceptionCard
              key={exception.id}
              exception={exception}
              onResolve={handleResolve}
            />
          ))}

          {/* Empty state */}
          {filteredExceptions.length === 0 && filteredPredictions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No exceptions require your attention.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                All automations running within authority — nothing to arbitrate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
