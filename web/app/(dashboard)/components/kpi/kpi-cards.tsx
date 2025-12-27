"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AlertTriangle, Users, ClipboardList, Calendar } from "lucide-react"

export function KPICards() {
    const requests = useQuery(api.maintenanceRequests.listAllRequests)

    // Calculate statistics
    const stats = {
        total: requests?.length || 0,
        new: requests?.filter((r) => r.status === "new").length || 0,
        inProgress: requests?.filter((r) => r.status === "in_progress").length || 0,
        repaired: requests?.filter((r) => r.status === "repaired").length || 0,
    }

    const cards = [
        {
            title: "Critical Equipment",
            value: "5 Units",
            subtitle: "Health < 30%",
            icon: AlertTriangle,
            iconBg: "bg-red-500/10",
            iconColor: "text-red-500",
        },
        {
            title: "Technician Load",
            value: "67%",
            subtitle: "Teeming Bee",
            icon: Users,
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
        },
        {
            title: "Open Requests",
            value: `${stats.new + stats.inProgress} Pending`,
            subtitle: `${stats.new} New`,
            icon: ClipboardList,
            iconBg: "bg-green-500/10",
            iconColor: "text-green-500",
        },
        {
            title: "Upcoming Maintenance",
            value: "4 This Week",
            subtitle: "Preventive Schedule",
            icon: Calendar,
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-500",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => {
                const Icon = card.icon
                return (
                    <div
                        key={card.title}
                        className="relative group bg-[#0B0B0D] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2.5 rounded-lg ${card.iconBg} border border-white/5`}>
                                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                            <button className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors">
                                View
                            </button>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 mb-1">{card.title}</p>
                            <p className="text-xl font-bold text-white mb-0.5">
                                {requests === undefined ? "..." : card.value}
                            </p>
                            <p className="text-xs text-zinc-600">{card.subtitle}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
