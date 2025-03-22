import "next-auth";

declare module "next-auth" {
    type Role = "podcaster:editor" | "podcaster:admin" | "authenticated" | "unauthenticated";

    interface User {
        role?: Role;
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: Role;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: Role;
    }
}
