import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const create = mutation({
    args: {
        name: v.string(),
        categoryId: v.id("equipmentCategories"),
        company: v.string(),
        department: v.string(),
        serialNumber: v.optional(v.string()),
        usedByEmployee: v.optional(v.string()),
        usedInLocation: v.optional(v.string()),
        technicianId: v.optional(v.id("users")),
        maintenanceTeamId: v.id("teams"),
        assignedDate: v.optional(v.number()),
        description: v.optional(v.string()),
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

        if (!viewer || viewer.role !== "manager") {
            throw new Error("Unauthorized: Only managers can add equipment");
        }

        return await ctx.db.insert("equipment", {
            ...args,
            isScrapped: false,
            createdAt: Date.now(),
        });
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("equipment").collect();
    },
});

export const update = mutation({
    args: {
        id: v.id("equipment"),
        name: v.optional(v.string()),
        categoryId: v.optional(v.id("equipmentCategories")),
        company: v.optional(v.string()),
        department: v.optional(v.string()),
        serialNumber: v.optional(v.string()),
        usedByEmployee: v.optional(v.string()),
        usedInLocation: v.optional(v.string()),
        technicianId: v.optional(v.id("users")),
        maintenanceTeamId: v.optional(v.id("teams")),
        description: v.optional(v.string()),
        isScrapped: v.optional(v.boolean()),
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

        if (!viewer || viewer.role !== "manager") {
            throw new Error("Unauthorized: Only managers can update equipment");
        }

        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    },
});
