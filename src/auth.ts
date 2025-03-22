import NextAuth, { type DefaultSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { Role } from "next-auth";
import { AuthenticationAdapter } from "@/lib/database/adapters/authentication";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: AuthenticationAdapter(),
    providers: [
        DiscordProvider({
            clientId: process.env.AUTH_DISCORD_ID!,
            clientSecret: process.env.AUTH_DISCORD_SECRET!,
            profile(profile) {
                const imageUrl = profile.avatar
                    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                    : null;

                return {
                    id: profile.id,
                    name: profile.username,
                    email: profile.email,
                    image: imageUrl,
                    role: "authenticated" as Role,
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role ?? "authenticated";
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = (token.role as Role) ?? "authenticated";
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
});
