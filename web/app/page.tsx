"use client";

import { AuthDrawer } from "@/components/web/auth-drawer";
import { useState } from "react";

export default function Page() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-col items-center gap-6 p-8">
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-12 py-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all duration-300 font-medium"
                >
                    Sign In
                </button>
                <AuthDrawer open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
            </main>
        </div>
    );
}