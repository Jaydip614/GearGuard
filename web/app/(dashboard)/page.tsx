"use client"

import { useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import { TopBar } from "./components/top-bar"
import { KPICards } from "./components/kpi/kpi-cards"
import { RequestTable } from "./components/tables/request-table"
import { KanbanBoard } from "./components/kanban/kanban-board"
import { CalendarView } from "./components/calendar/calendar-view"
import { EquipmentView } from "./components/views/equipment-view"
import { TeamsView } from "./components/teams/teams-view"
import { UserRequestsView } from "./components/views/user-requests-view"
import { ReportsView } from "./components/views/reports-view"
import { LoggedOutView } from "./components/views/logged-out-view"
import { UserSync } from "@/components/web/user-sync"
import { canViewKanban } from "@/lib/permissions"

export default function DashboardPage() {
    const [view, setView] = useState<"table" | "kanban">("table")
    const [activeTab, setActiveTab] = useState("Maintenance")
    const user = useQuery(api.users.getViewer)

    // Show logged out view if no user (preloaded query will make this instant)
    if (user === undefined) {
        // Still loading
        return null
    }

    if (user === null) {
        return <LoggedOutView />
    }

    const isNormalUser = user?.role === "user"
    const showKanbanToggle = canViewKanban(user?.role)
    const isManager = user?.role === "manager"

    return (
        <div className="min-h-screen bg-[#0B0B0D] text-white font-sans selection:bg-white/20">
            <UserSync />
            <TopBar currentTab={activeTab} onTabChange={setActiveTab} />

            <main className="max-w-[1600px] mx-auto px-6 py-8">
                {/* KPI Section - Only show on Maintenance tab for non-normal users */}
                {activeTab === "Maintenance" && !isNormalUser && <KPICards />}

                {/* Main Work Area */}
                <div className="space-y-4">
                    {activeTab === "Maintenance" && (
                        <>
                            {isNormalUser ? (
                                // Simplified view for normal users
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <UserRequestsView />
                                </div>
                            ) : (
                                // Full view for technicians and managers
                                <>
                                    {/* Toolbar */}
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-white">Maintenance Requests</h2>

                                        {showKanbanToggle && (
                                            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                                                <button
                                                    onClick={() => setView("table")}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                                        view === "table"
                                                            ? "bg-white/10 text-white shadow-sm"
                                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                    )}
                                                >
                                                    <List className="w-4 h-4" />
                                                    Table
                                                </button>
                                                <button
                                                    onClick={() => setView("kanban")}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                                        view === "kanban"
                                                            ? "bg-white/10 text-white shadow-sm"
                                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                    )}
                                                >
                                                    <LayoutGrid className="w-4 h-4" />
                                                    Kanban
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {view === "table" && <RequestTable />}
                                        {view === "kanban" && <KanbanBoard />}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === "Calendar" && isManager && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CalendarView />
                        </div>
                    )}

                    {activeTab === "Reports" && isManager && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ReportsView />
                        </div>
                    )}

                    {activeTab === "Equipment" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <EquipmentView />
                        </div>
                    )}

                    {activeTab === "Teams" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <TeamsView />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
