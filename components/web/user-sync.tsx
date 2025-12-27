"use client"

import { useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"

export function UserSync() {
    const { data: session } = authClient.useSession()
    const viewer = useQuery(api.users.getViewer)
    const bootstrapUser = useMutation(api.users.bootstrapUser)

    useEffect(() => {
        const syncUser = async () => {
            if (session?.user && viewer === null) {
                // User is logged in but not in our users table (or getViewer failed)
                // We attempt to bootstrap. bootstrapUser handles idempotency.
                await bootstrapUser({
                    authUserId: session.user.id,
                    email: session.user.email || "",
                    name: session.user.name || "",
                })
            }
        }

        syncUser()
    }, [session, viewer, bootstrapUser])

    return null
}
