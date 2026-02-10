import { useState, useMemo, useEffect, useCallback } from "react"
import PageHeader from "@/components/layout/PageHeader"
import QueueList from "@/components/supervision/QueueList"
import SupervisionDetailPanel from "@/components/supervision/SupervisionDetailPanel"
import {
  useDashboardState,
  useDashboardActions,
} from "@/store/DashboardContext"
import { toast } from "sonner"

export default function SupervisionQueue() {
  const { supervisionItems } = useDashboardState()
  const { approveSupervision, rejectSupervision } = useDashboardActions()

  // Sort items by time-sensitivity (most urgent = lowest minutesAgo first)
  const sortedItems = useMemo(
    () => [...supervisionItems].sort((a, b) => a.minutesAgo - b.minutesAgo),
    [supervisionItems]
  )

  const [selectedId, setSelectedId] = useState<string | null>(
    sortedItems[0]?.id ?? null
  )

  // Auto-select first item if selected was removed
  useEffect(() => {
    if (selectedId && !sortedItems.find((i) => i.id === selectedId)) {
      setSelectedId(sortedItems[0]?.id ?? null)
    }
  }, [sortedItems, selectedId])

  const selectedItem = sortedItems.find((i) => i.id === selectedId) ?? null
  const selectedIndex = sortedItems.findIndex((i) => i.id === selectedId)

  const selectNext = useCallback(() => {
    if (selectedIndex < sortedItems.length - 1) {
      setSelectedId(sortedItems[selectedIndex + 1].id)
    }
  }, [selectedIndex, sortedItems])

  const handleApprove = useCallback(
    (id: string) => {
      const item = sortedItems.find((i) => i.id === id)
      approveSupervision(id)
      toast.success("Approved", {
        description: item?.title ?? "Action approved and sent for execution.",
      })
    },
    [approveSupervision, sortedItems]
  )

  const handleReject = useCallback(
    (id: string) => {
      const item = sortedItems.find((i) => i.id === id)
      rejectSupervision(id)
      toast.error("Rejected", {
        description: item?.title ?? "Action rejected.",
      })
    },
    [rejectSupervision, sortedItems]
  )

  const handleEscalate = useCallback(
    (id: string) => {
      const item = sortedItems.find((i) => i.id === id)
      rejectSupervision(id) // remove from queue
      toast.info("Escalated", {
        description: `${item?.title ?? "Item"} — escalated to Partner.`,
      })
    },
    [rejectSupervision, sortedItems]
  )

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
            setSelectedId(sortedItems[selectedIndex - 1].id)
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
      selectedIndex,
      sortedItems,
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
        title="Supervision"
        subtitle="Review held actions — approve, modify, or reject"
      />

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 flex">
          {/* Left: Queue list */}
          <div className="flex min-w-0 flex-[55] flex-col">
            <QueueList
              items={sortedItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onApprove={handleApprove}
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
