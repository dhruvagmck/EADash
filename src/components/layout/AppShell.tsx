import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-full overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="relative h-full flex-1 overflow-hidden">
        <div className="absolute inset-0 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
