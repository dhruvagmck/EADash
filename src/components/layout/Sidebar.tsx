import { NavLink } from "react-router-dom"
import { NAV_ITEMS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme"
import { useBadgeCounts } from "@/store/DashboardContext"
import {
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
  Calendar,
  Plane,
  Receipt,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
            collapsed ? "justify-center px-2 py-4" : "px-4 py-4"
          )}
        >
          {!collapsed && (
            <p className="text-lg font-extrabold leading-tight tracking-tight">EA Cockpit</p>
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

        {/* ── External Tools ── */}
        <div
          className={cn(
            "flex shrink-0 flex-col gap-0.5 border-t border-slate-800 py-3",
            collapsed ? "px-2" : "px-2.5"
          )}
        >
          {!collapsed && (
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Tools
            </p>
          )}
          {[
            { label: "ShareCal", href: "https://sharecal.example.com", icon: Calendar },
            { label: "SkyLink", href: "https://skylink.example.com", icon: Plane },
            { label: "Aurora", href: "https://aurora.example.com", icon: Receipt },
          ].map((tool) => (
            <Tooltip key={tool.label}>
              <TooltipTrigger asChild>
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-row items-center rounded-md font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200",
                    collapsed
                      ? "justify-center px-0 py-2"
                      : "gap-[20px] px-3 py-2 text-[13px]"
                  )}
                >
                  <tool.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{tool.label}</span>
                      <ExternalLink className="h-3 w-3 text-slate-600" />
                    </>
                  )}
                </a>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {tool.label}
                  <ExternalLink className="ml-1.5 inline h-3 w-3 text-slate-400" />
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>

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
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage
                src="https://randomuser.me/api/portraits/men/85.jpg"
                alt="Alex Kim"
                className="object-cover"
              />
              <AvatarFallback className="bg-indigo-600 text-xs font-semibold text-white">
                AK
              </AvatarFallback>
            </Avatar>
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
