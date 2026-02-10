import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/lib/theme"
import { DashboardProvider } from "@/store/DashboardContext"
import { Toaster } from "sonner"
import "./index.css"

import AppShell from "@/components/layout/AppShell"
import PortfolioDashboard from "@/pages/PortfolioDashboard"
import AuthorityEditor from "@/pages/AuthorityEditor"
import SupervisionQueue from "@/pages/SupervisionQueue"
import ExceptionsView from "@/pages/ExceptionsView"
import InsightsView from "@/pages/InsightsView"
import SettingsView from "@/pages/SettingsView"
import PartnerProfileView from "@/pages/PartnerProfileView"

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/portfolio" replace /> },
      { path: "portfolio", element: <PortfolioDashboard /> },
      { path: "partners", element: <PartnerProfileView /> },
      { path: "authority", element: <AuthorityEditor /> },
      { path: "supervision", element: <SupervisionQueue /> },
      { path: "exceptions", element: <ExceptionsView /> },
      { path: "insights", element: <InsightsView /> },
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
