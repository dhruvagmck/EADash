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
  PartnerProfile,
  PartnerPreference,
  DeskNote,
  VIPContact,
  RecurringCommitment,
} from "@/data/types"
import { supervisionItems as initialSupervision } from "@/data/supervision"
import { exceptionItems as initialExceptions } from "@/data/exceptions"
import {
  authorityAdjustments as initialAdjustments,
  proactiveGuidance as initialGuidance,
} from "@/data/insights"
import { signalBlocks as initialSignals } from "@/data/signals"
import { partnerProfiles as initialProfiles } from "@/data/profiles"

// ── Actions ──

type Action =
  | { type: "APPROVE_SUPERVISION"; id: string }
  | { type: "REJECT_SUPERVISION"; id: string }
  | { type: "RESOLVE_EXCEPTION"; id: string }
  | { type: "UNDO_RESOLVE_EXCEPTION"; id: string }
  | { type: "DISMISS_ADJUSTMENT"; id: string }
  | { type: "DISMISS_GUIDANCE"; id: string }
  | { type: "DISMISS_SIGNAL_ITEM"; signalId: string; itemIndex: number }
  // Partner Profile actions
  | { type: "UPDATE_PREFERENCE"; partnerId: string; preference: PartnerPreference }
  | { type: "DELETE_PREFERENCE"; partnerId: string; preferenceId: string }
  | { type: "ADD_DESK_NOTE"; partnerId: string; note: DeskNote }
  | { type: "TOGGLE_PIN_NOTE"; partnerId: string; noteId: string }
  | { type: "UPDATE_COVERAGE_HANDOFF"; partnerId: string; text: string }
  | { type: "UPDATE_ESCALATION_NOTES"; partnerId: string; text: string }
  | { type: "ADD_VIP_CONTACT"; partnerId: string; contact: VIPContact }
  | { type: "REMOVE_VIP_CONTACT"; partnerId: string; contactName: string }
  | { type: "ADD_COMMITMENT"; partnerId: string; commitment: RecurringCommitment }
  | { type: "REMOVE_COMMITMENT"; partnerId: string; commitmentTitle: string }

// ── State ──

interface DashboardState {
  supervisionItems: SupervisionItem[]
  exceptionItems: ExceptionItem[]
  adjustments: AuthorityAdjustment[]
  guidance: ProactiveGuidance[]
  signals: SignalBlockData[]
  partnerProfiles: PartnerProfile[]
}

const initialState: DashboardState = {
  supervisionItems: [...initialSupervision],
  exceptionItems: [...initialExceptions],
  adjustments: [...initialAdjustments],
  guidance: [...initialGuidance],
  signals: [...initialSignals],
  partnerProfiles: [...initialProfiles],
}

// ── Helper: update a single partner profile ──

function updateProfile(
  profiles: PartnerProfile[],
  partnerId: string,
  updater: (p: PartnerProfile) => PartnerProfile
): PartnerProfile[] {
  return profiles.map((p) => (p.partnerId === partnerId ? updater(p) : p))
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

    // ── Partner Profile actions ──

    case "UPDATE_PREFERENCE": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => {
            const existing = p.preferences.findIndex(
              (pref) => pref.id === action.preference.id
            )
            const newPrefs =
              existing >= 0
                ? p.preferences.map((pref) =>
                    pref.id === action.preference.id ? action.preference : pref
                  )
                : [...p.preferences, action.preference]
            return { ...p, preferences: newPrefs, lastUpdated: "Just now", lastUpdatedBy: "You" }
          }
        ),
      }
    }

    case "DELETE_PREFERENCE": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            preferences: p.preferences.filter((pref) => pref.id !== action.preferenceId),
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
      }
    }

    case "ADD_DESK_NOTE": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            deskNotes: [action.note, ...p.deskNotes],
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
      }
    }

    case "TOGGLE_PIN_NOTE": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            deskNotes: p.deskNotes.map((n) =>
              n.id === action.noteId ? { ...n, pinned: !n.pinned } : n
            ),
          })
        ),
      }
    }

    case "UPDATE_COVERAGE_HANDOFF": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            coverageHandoff: action.text,
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
      }
    }

    case "UPDATE_ESCALATION_NOTES": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            escalationNotes: action.text,
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
      }
    }

    case "ADD_VIP_CONTACT": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            vipContacts: [...p.vipContacts, action.contact],
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
      }
    }

    case "REMOVE_VIP_CONTACT": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            vipContacts: p.vipContacts.filter((c) => c.name !== action.contactName),
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
      }
    }

    case "ADD_COMMITMENT": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            recurringCommitments: [...p.recurringCommitments, action.commitment],
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
      }
    }

    case "REMOVE_COMMITMENT": {
      return {
        ...state,
        partnerProfiles: updateProfile(
          state.partnerProfiles,
          action.partnerId,
          (p) => ({
            ...p,
            recurringCommitments: p.recurringCommitments.filter(
              (c) => c.title !== action.commitmentTitle
            ),
            lastUpdated: "Just now",
            lastUpdatedBy: "You",
          })
        ),
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

  // ── Profile actions ──

  const updatePreference = useCallback(
    (partnerId: string, preference: PartnerPreference) =>
      dispatch({ type: "UPDATE_PREFERENCE", partnerId, preference }),
    [dispatch]
  )

  const deletePreference = useCallback(
    (partnerId: string, preferenceId: string) =>
      dispatch({ type: "DELETE_PREFERENCE", partnerId, preferenceId }),
    [dispatch]
  )

  const addDeskNote = useCallback(
    (partnerId: string, note: DeskNote) =>
      dispatch({ type: "ADD_DESK_NOTE", partnerId, note }),
    [dispatch]
  )

  const togglePinNote = useCallback(
    (partnerId: string, noteId: string) =>
      dispatch({ type: "TOGGLE_PIN_NOTE", partnerId, noteId }),
    [dispatch]
  )

  const updateCoverageHandoff = useCallback(
    (partnerId: string, text: string) =>
      dispatch({ type: "UPDATE_COVERAGE_HANDOFF", partnerId, text }),
    [dispatch]
  )

  const updateEscalationNotes = useCallback(
    (partnerId: string, text: string) =>
      dispatch({ type: "UPDATE_ESCALATION_NOTES", partnerId, text }),
    [dispatch]
  )

  const addVIPContact = useCallback(
    (partnerId: string, contact: VIPContact) =>
      dispatch({ type: "ADD_VIP_CONTACT", partnerId, contact }),
    [dispatch]
  )

  const removeVIPContact = useCallback(
    (partnerId: string, contactName: string) =>
      dispatch({ type: "REMOVE_VIP_CONTACT", partnerId, contactName }),
    [dispatch]
  )

  const addCommitment = useCallback(
    (partnerId: string, commitment: RecurringCommitment) =>
      dispatch({ type: "ADD_COMMITMENT", partnerId, commitment }),
    [dispatch]
  )

  const removeCommitment = useCallback(
    (partnerId: string, commitmentTitle: string) =>
      dispatch({ type: "REMOVE_COMMITMENT", partnerId, commitmentTitle }),
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
    updatePreference,
    deletePreference,
    addDeskNote,
    togglePinNote,
    updateCoverageHandoff,
    updateEscalationNotes,
    addVIPContact,
    removeVIPContact,
    addCommitment,
    removeCommitment,
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
    "/partners": 0,
    "/authority": 0,
    "/supervision": supervisionItems.length,
    "/exceptions": exceptionItems.length,
    "/insights": adjustments.length + guidance.length,
    "/settings": 0,
  } as Record<string, number>
}
