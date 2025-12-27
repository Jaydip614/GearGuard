import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const create = mutation({
    args: {
        name: v.string(),
        company: v.string(),
        responsibleUserId: v.optional(v.id("users")),
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
            throw new Error("Unauthorized: Only managers can add categories");
        }

        return await ctx.db.insert("equipmentCategories", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("equipmentCategories"),
        name: v.string(),
        company: v.string(),
        responsibleUserId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user) throw new Error("Unauthenticated");

        const dbUser = await ctx.db
            .query("users")
            .withIndex("by_authUserId", (q) => q.eq("authUserId", user._id as string))
            .first();

        if (dbUser?.role !== "manager") {
            throw new Error("Unauthorized: Only managers can update categories");
        }

        await ctx.db.patch(args.id, {
            name: args.name,
            company: args.company,
            responsibleUserId: args.responsibleUserId,
        });
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("equipmentCategories").collect();
    },
});
