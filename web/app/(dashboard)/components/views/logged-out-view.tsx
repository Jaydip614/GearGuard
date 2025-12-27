"use client"

import { useState } from "react"
import { AuthDrawer } from "@/components/web/auth-drawer"
import { ArrowRight, ShieldCheck } from "lucide-react"

export function LoggedOutView() {
    const [isAuthOpen, setIsAuthOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-lg animate-in fade-in zoom-in duration-700">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl shadow-black/50">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    GearGuard
                </h1>
                <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
                    Enterprise maintenance management system.
                    <br />
                    Track equipment, schedule repairs, and manage teams.
                </p>

                <button
                    onClick={() => setIsAuthOpen(true)}
                    className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5"
                >
                    Sign In to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <AuthDrawer open={isAuthOpen} onOpenChange={setIsAuthOpen} />
        </div>
    )
}
