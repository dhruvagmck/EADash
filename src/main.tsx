import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/lib/ThemeProvider"
import { DashboardProvider } from "@/store/DashboardProvider"
import { Toaster } from "sonner"
import "./index.css"

import AppShell from "@/components/layout/AppShell"
import AtAGlance from "@/pages/AtAGlance"
import AuthorityEditor from "@/pages/AuthorityEditor"
import PendingInputQueue from "@/pages/PendingInputQueue"
import DecisionsView from "@/pages/DecisionsView"
import AISuggestionsView from "@/pages/AISuggestionsView"
import SettingsView from "@/pages/SettingsView"
import PreferencesView from "@/pages/PreferencesView"

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/at-a-glance" replace /> },
      { path: "at-a-glance", element: <AtAGlance /> },
      { path: "preferences", element: <PreferencesView /> },
      { path: "authority", element: <AuthorityEditor /> },
      { path: "pending-input", element: <PendingInputQueue /> },
      { path: "decisions", element: <DecisionsView /> },
      { path: "ai-suggestions", element: <AISuggestionsView /> },
      { path: "settings", element: <SettingsView /> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DashboardProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            className: "text-sm",
          }}
        />
      </DashboardProvider>
    </ThemeProvider>
  </StrictMode>
)
