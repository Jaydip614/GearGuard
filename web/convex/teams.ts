import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Unauthenticated");

        const teams = await ctx.db.query("teams").collect();

        // Enrich teams with member count
        const teamsWithCounts = await Promise.all(
            teams.map(async (team) => {
                const members = await ctx.db
                    .query("users")
                    .withIndex("by_team", (q) => q.eq("teamId", team._id))
                    .collect();
                return {
                    ...team,
                    memberCount: members.length,
                };
            })
        );

        return teamsWithCounts;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Unauthenticated");

        const dbUser = await ctx.db
            .query("users")
            .withIndex("by_authUserId", (q) => q.eq("authUserId", user._id as string))
            .first();

        if (dbUser?.role !== "manager") {
            throw new Error("Unauthorized: Only managers can create teams");
        }

        await ctx.db.insert("teams", {
            name: args.name,
            description: args.description,
            createdAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("teams"),
        name: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Unauthenticated");

        const dbUser = await ctx.db
            .query("users")
            .withIndex("by_authUserId", (q) => q.eq("authUserId", user._id as string))
            .first();

        if (dbUser?.role !== "manager") {
            throw new Error("Unauthorized: Only managers can update teams");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
            description: args.description,
        });
    },
});

export const addMember = mutation({
    args: {
        teamId: v.id("teams"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Unauthenticated");

        const dbUser = await ctx.db
            .query("users")
            .withIndex("by_authUserId", (q) => q.eq("authUserId", user._id as string))
            .first();

        if (dbUser?.role !== "manager") {
            throw new Error("Unauthorized: Only managers can manage team members");
        }

        const targetUser = await ctx.db.get(args.userId);
        if (!targetUser) {
            throw new Error("User not found");
        }

        const updates: { teamId: typeof args.teamId; role?: "technician" } = {
            teamId: args.teamId,
        };

        // If the user is a regular "user", promote them to "technician"
        if (targetUser.role === "user") {
            updates.role = "technician";
        }

        await ctx.db.patch(args.userId, updates);
    },
});

export const removeMember = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Unauthenticated");

        const dbUser = await ctx.db
            .query("users")
            .withIndex("by_authUserId", (q) => q.eq("authUserId", user._id as string))
            .first();

        if (dbUser?.role !== "manager") {
            throw new Error("Unauthorized: Only managers can manage team members");
        }

        await ctx.db.patch(args.userId, {
            teamId: undefined,
        });
    },
});

export const getMembers = query({
    args: { teamId: v.id("teams") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
            .collect();
    },
});
