import { query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

/**
 * Get scheduled maintenance for calendar view
 * Returns preventive maintenance requests within a date range
 */
export const getScheduledMaintenance = query({
    args: {
        startDate: v.number(),
        endDate: v.number(),
    },
    handler: async (ctx, args) => {
        const viewerAuth = await authComponent.getAuthUser(ctx);
        if (!viewerAuth) {
            throw new Error("Unauthorized");
        }

        const viewer = await ctx.db
            .query("users")
            .withIndex("by_authUserId", (q) => q.eq("authUserId", viewerAuth._id as string))
            .first();

        if (!viewer) {
            throw new Error("User not found");
        }

        // Only managers and technicians can view calendar
        if (viewer.role === "user") {
            throw new Error("Unauthorized: Calendar access restricted");
        }

        // Get all preventive maintenance requests
        let requests = await ctx.db
            .query("maintenanceRequests")
            .filter((q) => q.eq(q.field("type"), "preventive"))
            .collect();

        // Filter by team for technicians
        if (viewer.role === "technician" && viewer.teamId) {
            requests = requests.filter((r) => r.teamId === viewer.teamId);
        }

        // Filter by date range
        requests = requests.filter((r) => {
            if (!r.scheduledDate) return false;
            return r.scheduledDate >= args.startDate && r.scheduledDate <= args.endDate;
        });

        // Enrich with equipment and technician details
        const enrichedRequests = await Promise.all(
            requests.map(async (request) => {
                const equipment = request.equipmentId
                    ? await ctx.db.get(request.equipmentId)
                    : null;

                const assignedTechnician = request.assignedTo
                    ? await ctx.db.get(request.assignedTo)
                    : null;

                const createdBy = await ctx.db.get(request.createdBy);

                return {
                    ...request,
                    equipment,
                    assignedTechnician,
                    createdBy,
                };
            })
        );

        return enrichedRequests;
    },
});
