import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from "react"
import type {
  SupervisionItem,
  ExceptionItem,
  AuthorityAdjustment,
  ProactiveGuidance,
  SignalBlockData,
} from "@/data/types"
import { supervisionItems as initialSupervision } from "@/data/supervision"
import { exceptionItems as initialExceptions } from "@/data/exceptions"
import {
  authorityAdjustments as initialAdjustments,
  proactiveGuidance as initialGuidance,
} from "@/data/insights"
import { signalBlocks as initialSignals } from "@/data/signals"

// ── Actions ──

type Action =
  | { type: "APPROVE_SUPERVISION"; id: string }
  | { type: "REJECT_SUPERVISION"; id: string }
  | { type: "RESOLVE_EXCEPTION"; id: string }
  | { type: "UNDO_RESOLVE_EXCEPTION"; id: string }
  | { type: "DISMISS_ADJUSTMENT"; id: string }
  | { type: "DISMISS_GUIDANCE"; id: string }
  | { type: "DISMISS_SIGNAL_ITEM"; signalId: string; itemIndex: number }

// ── State ──

interface DashboardState {
  supervisionItems: SupervisionItem[]
  exceptionItems: ExceptionItem[]
  adjustments: AuthorityAdjustment[]
  guidance: ProactiveGuidance[]
  signals: SignalBlockData[]
}

const initialState: DashboardState = {
  supervisionItems: [...initialSupervision],
  exceptionItems: [...initialExceptions],
  adjustments: [...initialAdjustments],
  guidance: [...initialGuidance],
  signals: [...initialSignals],
}

// ── Reducer ──

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "APPROVE_SUPERVISION":
    case "REJECT_SUPERVISION":
      return {
        ...state,
        supervisionItems: state.supervisionItems.filter(
          (i) => i.id !== action.id
        ),
      }

    case "RESOLVE_EXCEPTION":
      return {
        ...state,
        exceptionItems: state.exceptionItems.filter(
          (e) => e.id !== action.id
        ),
      }

    case "UNDO_RESOLVE_EXCEPTION": {
      const restored = initialExceptions.find((e) => e.id === action.id)
      return restored
        ? { ...state, exceptionItems: [...state.exceptionItems, restored] }
        : state
    }

    case "DISMISS_ADJUSTMENT":
      return {
        ...state,
        adjustments: state.adjustments.filter((a) => a.id !== action.id),
      }

    case "DISMISS_GUIDANCE":
      return {
        ...state,
        guidance: state.guidance.filter((g) => g.id !== action.id),
      }

    case "DISMISS_SIGNAL_ITEM": {
      return {
        ...state,
        signals: state.signals
          .map((s) => {
            if (s.id !== action.signalId) return s
            const newItems = s.detailItems.filter(
              (_, i) => i !== action.itemIndex
            )
            return {
              ...s,
              detailItems: newItems,
              count: Math.max(0, s.count - 1),
            }
          })
          .filter((s) => s.count > 0),
      }
    }

    default:
      return state
  }
}

// ── Context ──

const DashboardStateCtx = createContext<DashboardState>(initialState)
const DashboardDispatchCtx = createContext<Dispatch<Action>>(() => {})

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <DashboardStateCtx.Provider value={state}>
      <DashboardDispatchCtx.Provider value={dispatch}>
        {children}
      </DashboardDispatchCtx.Provider>
    </DashboardStateCtx.Provider>
  )
}

// ── Hooks ──

export function useDashboardState() {
  return useContext(DashboardStateCtx)
}

export function useDashboardDispatch() {
  return useContext(DashboardDispatchCtx)
}

/** Convenience hook for common actions with toast side-effects */
export function useDashboardActions() {
  const dispatch = useDashboardDispatch()

  const approveSupervision = useCallback(
    (id: string) => dispatch({ type: "APPROVE_SUPERVISION", id }),
    [dispatch]
  )

  const rejectSupervision = useCallback(
    (id: string) => dispatch({ type: "REJECT_SUPERVISION", id }),
    [dispatch]
  )

  const resolveException = useCallback(
    (id: string) => dispatch({ type: "RESOLVE_EXCEPTION", id }),
    [dispatch]
  )

  const undoResolveException = useCallback(
    (id: string) => dispatch({ type: "UNDO_RESOLVE_EXCEPTION", id }),
    [dispatch]
  )

  const dismissAdjustment = useCallback(
    (id: string) => dispatch({ type: "DISMISS_ADJUSTMENT", id }),
    [dispatch]
  )

  const dismissGuidance = useCallback(
    (id: string) => dispatch({ type: "DISMISS_GUIDANCE", id }),
    [dispatch]
  )

  const dismissSignalItem = useCallback(
    (signalId: string, itemIndex: number) =>
      dispatch({ type: "DISMISS_SIGNAL_ITEM", signalId, itemIndex }),
    [dispatch]
  )

  return {
    approveSupervision,
    rejectSupervision,
    resolveException,
    undoResolveException,
    dismissAdjustment,
    dismissGuidance,
    dismissSignalItem,
  }
}

/** Badge counts derived from state */
export function useBadgeCounts() {
  const { supervisionItems, exceptionItems, adjustments, guidance, signals } =
    useDashboardState()

  const portfolioAttention = signals.filter(
    (s) => s.severity === "urgent" || s.severity === "review"
  ).length

  return {
    "/portfolio": portfolioAttention,
    "/authority": 0,
    "/supervision": supervisionItems.length,
    "/exceptions": exceptionItems.length,
    "/insights": adjustments.length + guidance.length,
    "/settings": 0,
  } as Record<string, number>
}
