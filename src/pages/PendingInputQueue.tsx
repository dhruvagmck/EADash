import { useState, useMemo, useEffect, useCallback } from "react"
import PageHeader from "@/components/layout/PageHeader"
import QueueList from "@/components/pending-input/QueueList"
import SupervisionDetailPanel from "@/components/pending-input/SupervisionDetailPanel"
import PartnerFilterBar from "@/components/shared/PartnerFilterBar"
import {
  useDashboardState,
  useDashboardActions,
} from "@/store/DashboardProvider"
import { partners } from "@/data/partners"
import { toast } from "sonner"
import { loadSettings } from "@/lib/settings"

export default function PendingInputQueue() {
  const { supervisionItems } = useDashboardState()
  const { approveSupervision, rejectSupervision } = useDashboardActions()

  // Load persisted settings for queue sort + shortcuts toggle
  const settings = useMemo(() => loadSettings(), [])

  // Partner filter: null = all partners
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null
  )

  // Sort items according to user's queue sort preference
  const sortedItems = useMemo(() => {
    const items = [...supervisionItems]
    switch (settings.queueSort) {
      case "by-partner":
        return items.sort((a, b) => a.partnerId.localeCompare(b.partnerId))
      case "by-domain":
        return items.sort((a, b) => a.domain.localeCompare(b.domain))
      case "by-confidence":
        // Lower minutesAgo → more urgent; use as proxy for confidence ordering
        return items.sort((a, b) => b.minutesAgo - a.minutesAgo)
      case "time-sensitive":
      default:
        return items.sort((a, b) => a.minutesAgo - b.minutesAgo)
    }
  }, [supervisionItems, settings.queueSort])

  // Filter by selected partner
  const filteredItems = useMemo(
    () =>
      selectedPartnerId
        ? sortedItems.filter((i) => i.partnerId === selectedPartnerId)
        : sortedItems,
    [sortedItems, selectedPartnerId]
  )

  // Count items per partner for the filter bar badges
  const partnerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of sortedItems) {
      counts[item.partnerId] = (counts[item.partnerId] || 0) + 1
    }
    return counts
  }, [sortedItems])

  const [selectedId, setSelectedId] = useState<string | null>(
    filteredItems[0]?.id ?? null
  )

  // Auto-select first item if selected was removed or filtered out
  useEffect(() => {
    if (selectedId && !filteredItems.find((i) => i.id === selectedId)) {
      setSelectedId(filteredItems[0]?.id ?? null)
    }
  }, [filteredItems, selectedId])

  const selectedItem = filteredItems.find((i) => i.id === selectedId) ?? null
  const selectedIndex = filteredItems.findIndex((i) => i.id === selectedId)

  const selectNext = useCallback(() => {
    if (selectedIndex < filteredItems.length - 1) {
      setSelectedId(filteredItems[selectedIndex + 1].id)
    }
  }, [selectedIndex, filteredItems])

  const handleApprove = useCallback(
    (id: string) => {
      const item = filteredItems.find((i) => i.id === id)
      approveSupervision(id)
      toast.success("Approved", {
        description: item?.title ?? "Action approved and sent for execution.",
      })
    },
    [approveSupervision, filteredItems]
  )

  const handleReject = useCallback(
    (id: string) => {
      const item = filteredItems.find((i) => i.id === id)
      rejectSupervision(id)
      toast.error("Rejected", {
        description: item?.title ?? "Action rejected.",
      })
    },
    [rejectSupervision, filteredItems]
  )

  const handleEscalate = useCallback(
    (id: string) => {
      const item = filteredItems.find((i) => i.id === id)
      rejectSupervision(id) // remove from queue
      toast.info("Escalated", {
        description: `${item?.title ?? "Item"} — escalated to Partner.`,
      })
    },
    [rejectSupervision, filteredItems]
  )

  const handleBatchApproveLowRisk = useCallback(() => {
    // Low-risk: scheduling items (internal moves / room bookings) that don't
    // involve conflicts or urgent external parties.
    const lowRisk = filteredItems.filter(
      (i) =>
        i.proposedAction.type === "scheduling" ||
        i.proposedAction.type === "expense"
    )
    if (lowRisk.length === 0) {
      toast.info("No low-risk items", {
        description: "All current items require individual review.",
      })
      return
    }
    for (const item of lowRisk) {
      approveSupervision(item.id)
    }
    toast.success(`Batch approved ${lowRisk.length} low-risk item${lowRisk.length !== 1 ? "s" : ""}`, {
      description: "Scheduling and expense items approved and sent for execution.",
    })
  }, [filteredItems, approveSupervision])

  // Keyboard shortcuts (respects settings toggle)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!settings.shortcutsEnabled) return

      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault()
          selectNext()
          break
        case "p":
        case "P":
          e.preventDefault()
          if (selectedIndex > 0) {
            setSelectedId(filteredItems[selectedIndex - 1].id)
          }
          break
        case "Enter":
          e.preventDefault()
          if (selectedItem) handleApprove(selectedItem.id)
          break
        case "r":
        case "R":
          e.preventDefault()
          if (selectedItem) handleReject(selectedItem.id)
          break
        case "e":
        case "E":
          e.preventDefault()
          if (selectedItem) handleEscalate(selectedItem.id)
          break
      }
    },
    [
      settings.shortcutsEnabled,
      selectedIndex,
      filteredItems,
      selectedItem,
      selectNext,
      handleApprove,
      handleReject,
      handleEscalate,
    ]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Pending Input"
        subtitle="Held actions awaiting your sign-off before they execute"
      />

      {/* Partner filter bar */}
      <PartnerFilterBar
        partners={partners}
        selectedPartnerId={selectedPartnerId}
        onSelectPartner={setSelectedPartnerId}
        partnerCounts={partnerCounts}
        totalCount={sortedItems.length}
      />

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 flex">
          {/* Left: Queue list */}
          <div className="flex min-w-0 flex-[55] flex-col">
            <QueueList
              items={filteredItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onApprove={handleApprove}
              onBatchApproveLowRisk={handleBatchApproveLowRisk}
              selectedPartnerId={selectedPartnerId}
            />
          </div>

          {/* Right: Detail panel */}
          <div className="flex min-w-0 flex-[45] flex-col">
            <SupervisionDetailPanel
              item={selectedItem}
              onApprove={handleApprove}
              onReject={handleReject}
              onEscalate={handleEscalate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
