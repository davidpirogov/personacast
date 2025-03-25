/**
 * This script ensures that the SHOW_DEBUG_CONTROLS variable exists in the database.
 * It will create the variable if it doesn't exist, or update it if it does.
 */

import { variablesService } from "@/services/variables-service";

async function main() {
    try {
        console.log("Checking for SHOW_DEBUG_CONTROLS variable...");

        // Check if the variable already exists
        const existing = await variablesService.getByName("SHOW_DEBUG_CONTROLS");

        // Get the value from environment variable
        const envValue = process.env.APP_SHOW_DEBUG_CONTROLS === "true" ? "true" : "false";

        if (existing) {
            console.log("SHOW_DEBUG_CONTROLS variable exists, updating value...");
            await variablesService.update(existing.id, { value: envValue });
            console.log(`Updated SHOW_DEBUG_CONTROLS to: ${envValue}`);
        } else {
            console.log("SHOW_DEBUG_CONTROLS variable does not exist, creating...");
            await variablesService.create({
                name: "SHOW_DEBUG_CONTROLS",
                value: envValue,
            });
            console.log(`Created SHOW_DEBUG_CONTROLS with value: ${envValue}`);
        }

        console.log("Done!");
    } catch (error) {
        console.error("Error ensuring SHOW_DEBUG_CONTROLS variable:", error);
        process.exit(1);
    }
}

main().catch(console.error);
