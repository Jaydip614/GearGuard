"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { TrendingUp, TrendingDown, Users, Wrench, Package, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReportsView() {
    const [dateRange, setDateRange] = useState<{ startDate?: number; endDate?: number }>({})

    const requestsOverview = useQuery(api.reports.getRequestsOverview, dateRange)
    const teamPerformance = useQuery(api.reports.getTeamPerformance, dateRange)
    const technicianWorkload = useQuery(api.reports.getTechnicianWorkload, dateRange)
    const equipmentInsights = useQuery(api.reports.getEquipmentInsights, dateRange)

    const isLoading = !requestsOverview || !teamPerformance || !technicianWorkload || !equipmentInsights

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                    <p className="text-sm text-zinc-400 mt-1">System-wide maintenance performance insights</p>
                </div>
            </div>

            {/* 1️⃣ Requests Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Requests */}
                <div className="bg-[#121214] rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-zinc-400">Total Requests</p>
                        <p className="text-3xl font-bold text-white">{requestsOverview.total}</p>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-green-400">{requestsOverview.closed} closed</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-yellow-400">{requestsOverview.open} open</span>
                        </div>
                    </div>
                </div>

                {/* Overdue Requests */}
                <div className="bg-[#121214] rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-zinc-400">Overdue (7+ days)</p>
                        <p className="text-3xl font-bold text-white">{requestsOverview.overdue}</p>
                        <p className="text-xs text-zinc-500">Requires attention</p>
                    </div>
                </div>

                {/* Corrective vs Preventive */}
                <div className="bg-[#121214] rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-zinc-400">Corrective</p>
                        <p className="text-3xl font-bold text-white">{requestsOverview.correctivePercentage}%</p>
                        <p className="text-xs text-zinc-500">{requestsOverview.corrective} requests</p>
                    </div>
                </div>

                <div className="bg-[#121214] rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-zinc-400">Preventive</p>
                        <p className="text-3xl font-bold text-white">{requestsOverview.preventivePercentage}%</p>
                        <p className="text-xs text-zinc-500">{requestsOverview.preventive} requests</p>
                    </div>
                </div>
            </div>

            {/* 2️⃣ Team Performance */}
            <div className="bg-[#121214] rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Team Performance</h2>
                        <p className="text-sm text-zinc-400">Requests handled and resolution times</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {teamPerformance.map((team) => (
                        <div
                            key={team.teamId}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-white">{team.teamName}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-zinc-400">
                                        {team.totalRequests} total
                                    </span>
                                    <span className="text-green-400">
                                        {team.completed} completed
                                    </span>
                                    <span className="text-yellow-400">
                                        {team.open} open
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-zinc-400">Avg Resolution</p>
                                <p className="text-lg font-semibold text-white">
                                    {team.avgResolutionTimeHours}h
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3️⃣ Technician Workload */}
            <div className="bg-[#121214] rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Technician Workload</h2>
                        <p className="text-sm text-zinc-400">Individual performance metrics</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Technician</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">Assigned</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">Completed</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">In Progress</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">Avg Repair Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {technicianWorkload.map((tech) => (
                                <tr key={tech.technicianId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-medium text-indigo-400">
                                                {tech.technicianName[0]}
                                            </div>
                                            <span className="text-white font-medium">{tech.technicianName}</span>
                                        </div>
                                    </td>
                                    <td className="text-center py-3 px-4 text-white">{tech.currentlyAssigned}</td>
                                    <td className="text-center py-3 px-4 text-green-400">{tech.completed}</td>
                                    <td className="text-center py-3 px-4 text-yellow-400">{tech.inProgress}</td>
                                    <td className="text-center py-3 px-4 text-white">{tech.avgRepairTimeHours}h</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4️⃣ Equipment Insights */}
            <div className="bg-[#121214] rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Equipment Insights</h2>
                        <p className="text-sm text-zinc-400">Most frequently failing equipment</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-sm text-zinc-400 mb-1">Total Equipment</p>
                        <p className="text-2xl font-bold text-white">{equipmentInsights.totalEquipment}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-sm text-zinc-400 mb-1">Scrapped</p>
                        <p className="text-2xl font-bold text-red-400">{equipmentInsights.totalScrapped}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-400 mb-3">Top 10 Most Failing Equipment</p>
                    {equipmentInsights.equipmentStats.slice(0, 10).map((eq) => (
                        <div
                            key={eq.equipmentId}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-white">{eq.equipmentName}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs">
                                    <span className="text-zinc-400">{eq.category}</span>
                                    <span className="text-zinc-600">•</span>
                                    <span className="text-zinc-400">{eq.department}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-zinc-400">Requests</p>
                                    <p className="text-lg font-semibold text-white">{eq.totalRequests}</p>
                                </div>
                                {eq.scrappedCount > 0 && (
                                    <div className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-xs text-red-300">
                                        {eq.scrappedCount} scrapped
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
