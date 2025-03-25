import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding the database...");

    // Create main menu items
    const mainMenuItems = [
        {
            label: "Home",
            href: "/",
            order: 1,
            isActive: true,
            isSystem: true,
            requiredRoles: [],
        },
        {
            label: "Podcasts",
            href: "/podcasts",
            order: 2,
            isActive: true,
            isSystem: true,
            requiredRoles: [],
        },
        {
            label: "Studio",
            href: "/studio",
            order: 3,
            isActive: true,
            isSystem: true,
            requiredRoles: ["podcaster:editor", "podcaster:admin"],
        },
        {
            label: "Admin",
            href: "/admin",
            order: 4,
            isActive: true,
            isSystem: true,
            requiredRoles: ["podcaster:admin"],
        },
    ];

    // Insert main menu items
    const mainItems = await Promise.all(
        mainMenuItems.map(async (item) => {
            // Check if the item already exists
            const existing = await prisma.menuItem.findFirst({
                where: { href: item.href, isSystem: true },
            });

            if (existing) {
                console.log(`Menu item ${item.label} already exists. Skipping.`);
                return existing;
            }

            return prisma.menuItem.create({
                data: item,
            });
        }),
    );

    // Find admin parent item
    const adminItem = mainItems.find((item) => item.href === "/admin");

    if (adminItem) {
        // Create admin sub-menu items
        const adminSubMenuItems = [
            {
                label: "API Clients",
                href: "/admin/api-clients",
                order: 1,
                isActive: true,
                isSystem: true,
                requiredRoles: ["podcaster:admin"],
                parentId: adminItem.id,
            },
            {
                label: "Users",
                href: "/admin/users",
                order: 2,
                isActive: true,
                isSystem: true,
                requiredRoles: ["podcaster:admin"],
                parentId: adminItem.id,
            },
            {
                label: "Theming",
                href: "/admin/theming",
                order: 3,
                isActive: true,
                isSystem: true,
                requiredRoles: ["podcaster:admin"],
                parentId: adminItem.id,
            },
            {
                label: "Files",
                href: "/admin/files",
                order: 4,
                isActive: true,
                isSystem: true,
                requiredRoles: ["podcaster:admin"],
                parentId: adminItem.id,
            },
            {
                label: "Hero Images",
                href: "/admin/hero-images",
                order: 5,
                isActive: true,
                isSystem: true,
                requiredRoles: ["podcaster:admin"],
                parentId: adminItem.id,
            },
            {
                label: "Variables",
                href: "/admin/variables",
                order: 6,
                isActive: true,
                isSystem: true,
                requiredRoles: ["podcaster:admin"],
                parentId: adminItem.id,
            },
            {
                label: "Menu Items",
                href: "/admin/menu",
                order: 7,
                isActive: true,
                isSystem: true,
                requiredRoles: ["podcaster:admin"],
                parentId: adminItem.id,
            },
        ];

        // Insert admin sub-menu items
        await Promise.all(
            adminSubMenuItems.map(async (item) => {
                // Check if the item already exists
                const existing = await prisma.menuItem.findFirst({
                    where: { href: item.href, isSystem: true },
                });

                if (existing) {
                    console.log(`Menu item ${item.label} already exists. Skipping.`);
                    return existing;
                }

                return prisma.menuItem.create({
                    data: item,
                });
            }),
        );
    }

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error("Error seeding the database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
