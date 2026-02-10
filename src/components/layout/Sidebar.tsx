import { NavLink } from "react-router-dom"
import { NAV_ITEMS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme"
import { useBadgeCounts } from "@/store/DashboardContext"
import { Sun, Moon, PanelLeftClose, PanelLeft } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const badgeCounts = useBadgeCounts()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen shrink-0 flex-col bg-slate-900 text-slate-100 transition-all duration-200",
          collapsed ? "w-14" : "w-64"
        )}
      >
        {/* ── Logo ── */}
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-slate-800",
            collapsed ? "justify-center px-2 py-4" : "gap-2.5 px-4 py-4"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
            EA
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold leading-tight">EA HITL</p>
              <p className="text-[11px] text-slate-400">
                Orchestration Dashboard
              </p>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav
          className={cn(
            "flex flex-1 flex-col gap-0.5 overflow-y-auto py-3",
            collapsed ? "px-2" : "px-2.5"
          )}
        >
          {NAV_ITEMS.map((item) => {
            const badge = badgeCounts[item.path] ?? item.badge
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "relative flex flex-row items-center rounded-md font-medium transition-colors",
                        collapsed
                          ? "justify-center px-0 py-2.5"
                          : "gap-[20px] px-3 py-2.5 text-[13px]",
                        isActive
                          ? "bg-slate-700/80 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !collapsed && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-indigo-400" />
                        )}
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            isActive && "text-indigo-400"
                          )}
                        />
                        {!collapsed && (
                          <span className="flex-1">{item.label}</span>
                        )}
                        {!collapsed && badge > 0 && (
                          <Badge
                            variant="secondary"
                            className="h-5 min-w-5 justify-center rounded-full bg-slate-700 px-1.5 text-[10px] font-semibold text-slate-200"
                          >
                            {badge}
                          </Badge>
                        )}
                        {collapsed && badge > 0 && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[9px] font-bold text-white">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-2"
                  >
                    {item.label}
                    {badge > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
                      >
                        {badge}
                      </Badge>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        {/* ── Bottom controls ── */}
        <div
          className={cn(
            "flex flex-col gap-0.5 border-t border-slate-800 py-3",
            collapsed ? "px-2" : "px-2.5"
          )}
        >
          {/* Collapse toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle}
                className={cn(
                  "flex flex-row items-center rounded-md font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200",
                  collapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-[20px] px-3 py-2.5 text-[13px]"
                )}
              >
                {collapsed ? (
                  <PanelLeft className="h-[18px] w-[18px] shrink-0" />
                ) : (
                  <>
                    <PanelLeftClose className="h-[18px] w-[18px] shrink-0" />
                    <span>Collapse</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            )}
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex flex-row items-center rounded-md bg-slate-800 font-medium text-slate-200 transition-colors hover:bg-slate-700",
                  collapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-[20px] px-3 py-2.5 text-[13px]"
                )}
              >
                {theme === "light" ? (
                  <Moon className="h-[18px] w-[18px] shrink-0 text-indigo-400" />
                ) : (
                  <Sun className="h-[18px] w-[18px] shrink-0 text-amber-400" />
                )}
                {!collapsed && (
                  <span>
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* ── User ── */}
        <div
          className={cn(
            "shrink-0 border-t border-slate-800",
            collapsed ? "flex justify-center px-2 py-3" : "px-4 py-3"
          )}
        >
          <div className="flex flex-row items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              AK
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-200">
                  Alex Kim
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  2 Partners
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
