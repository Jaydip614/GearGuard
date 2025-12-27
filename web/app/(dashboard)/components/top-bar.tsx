"use client"

import { Search, Bell, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AuthDrawer } from "@/components/web/auth-drawer"
import { EquipmentDrawer } from "@/components/web/equipment-drawer"
import { authClient } from "@/lib/auth-client"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getVisibleTabs } from "@/lib/permissions"

interface TopBarProps {
    currentTab: string
    onTabChange: (tab: string) => void
}

export function TopBar({ currentTab, onTabChange }: TopBarProps) {
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const { data: session } = authClient.useSession()

    // Fetch user role from Convex to check permissions
    const user = useQuery(api.users.getViewer)
    const isManager = user?.role === "manager"
    const isNormalUser = user?.role === "user"

    // Get tabs based on user role
    const tabs = getVisibleTabs(user?.role)

    return (
        <div className="w-full border-b border-white/10 bg-[#0B0B0D]/50 backdrop-blur-xl sticky top-0 z-30">
            <div className="max-w-[1600px] mx-auto h-16 px-6 flex items-center justify-between gap-8">
                {/* Left: Tabs */}
                <div className="flex items-center gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                currentTab === tab
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Center: Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder={isNormalUser ? "Search my requests..." : "Search requests, equipment, or technicians..."}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all"
                        />
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-4">
                    {isManager && <EquipmentDrawer />}

                    <button className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0B0D]" />
                    </button>

                    <div className="h-6 w-px bg-white/10" />

                    <button
                        onClick={() => setIsAuthOpen(true)}
                        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-all group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white group-hover:text-white/90">
                                {session?.user?.name || "Sign In"}
                            </p>
                            <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
                                {session?.user?.email || "Guest"}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-[#0B0B0D] shadow-lg overflow-hidden">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-white" />
                            )}
                        </div>
                    </button>
                </div>
            </div>

            <AuthDrawer open={isAuthOpen} onOpenChange={setIsAuthOpen} />
        </div>
    )
}
