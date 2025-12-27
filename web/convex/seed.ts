import { mutation } from "./_generated/server";

/**
 * Seed initial data:
 * - Teams
 * - Equipment Categories
 * - Equipment
 *
 * Safe to run multiple times.
 */
export const seed = mutation({
    handler: async (ctx) => {
        const now = Date.now();

        /*
         ─────────────────────────────
         1️⃣ TEAMS
         ─────────────────────────────
        */
        const existingTeams = await ctx.db.query("teams").collect();
        if (existingTeams.length === 0) {
            await ctx.db.insert("teams", {
                name: "IT Support",
                description: "Handles computers, printers, software",
                createdAt: now,
            });

            await ctx.db.insert("teams", {
                name: "Internal Maintenance",
                description: "Handles office hardware and facilities",
                createdAt: now,
            });
        }

        const teams = await ctx.db.query("teams").collect();
        const itTeam = teams.find(t => t.name === "IT Support")!;
        const maintenanceTeam = teams.find(t => t.name === "Internal Maintenance")!;

        /*
         ─────────────────────────────
         2️⃣ EQUIPMENT CATEGORIES
         ─────────────────────────────
        */
        const existingCategories = await ctx.db.query("equipmentCategories").collect();
        if (existingCategories.length === 0) {
            await ctx.db.insert("equipmentCategories", {
                name: "Computers",
                company: "My Company (San Francisco)",
                createdAt: now,
            });

            await ctx.db.insert("equipmentCategories", {
                name: "Monitors",
                company: "My Company (San Francisco)",
                createdAt: now,
            });

            await ctx.db.insert("equipmentCategories", {
                name: "Software",
                company: "My Company (San Francisco)",
                createdAt: now,
            });
        }

        const categories = await ctx.db.query("equipmentCategories").collect();
        const computersCategory = categories.find(c => c.name === "Computers")!;
        const monitorsCategory = categories.find(c => c.name === "Monitors")!;

        /*
         ─────────────────────────────
         3️⃣ EQUIPMENT
         ─────────────────────────────
        */
        const existingEquipment = await ctx.db.query("equipment").collect();
        if (existingEquipment.length === 0) {
            await ctx.db.insert("equipment", {
                name: "Samsung Monitor 15\"",
                categoryId: monitorsCategory._id,

                company: "My Company (San Francisco)",
                department: "Admin",

                serialNumber: "SM-1522-XY",

                usedByEmployee: "Abigail Peterson",
                usedInLocation: "Office - Floor 2",

                maintenanceTeamId: maintenanceTeam._id,
                technicianId: undefined,

                assignedDate: now,
                description: "Office workstation monitor",

                isScrapped: false,
                createdAt: now,
            });

            await ctx.db.insert("equipment", {
                name: "Acer Laptop",
                categoryId: computersCategory._id,

                company: "My Company (San Francisco)",
                department: "Engineering",

                serialNumber: "ACER-ENG-8891",

                usedByEmployee: "Bruce P",
                usedInLocation: "Engineering Lab",

                maintenanceTeamId: itTeam._id,
                technicianId: undefined,

                assignedDate: now,
                description: "Primary development laptop",

                isScrapped: false,
                createdAt: now,
            });
        }

        return { success: true };
    },
});
