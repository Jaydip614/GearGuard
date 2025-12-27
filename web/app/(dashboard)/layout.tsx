import { preloadAuthQuery } from "@/lib/auth-server"
import { api } from "@/convex/_generated/api"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Preload user query on server to eliminate flash
    await preloadAuthQuery(api.users.getViewer)

    return <>{children}</>
}
