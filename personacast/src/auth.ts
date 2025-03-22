import NextAuth, { type DefaultSession } from "next-auth";
import MicrosoftEntraIdProvider from "next-auth/providers/microsoft-entra-id";
import DiscordProvider from "next-auth/providers/discord";
import type { Role } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

async function processProfileImage(imageBuffer: ArrayBuffer): Promise<string | null> {
    try {
        const response = await fetch("/api/image", {
            method: "POST",
            body: imageBuffer,
        });

        if (!response.ok) {
            throw new Error("Failed to process image");
        }

        const data = await response.json();
        return data.image;
    } catch (error) {
        console.error("Error processing profile photo:", error);
        return null;
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.AUTH_DISCORD_ID,
            clientSecret: process.env.AUTH_DISCORD_SECRET,
            async profile(profile, tokens) {
                const response = await fetch(
                    `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
                );

                let image = null;
                if (response.ok) {
                    const pictureBuffer = await response.arrayBuffer();
                    image = await processProfileImage(pictureBuffer);
                }

                return {
                    id: profile.id,
                    name: profile.username,
                    email: profile.email,
                    role: "authenticated",
                    image,
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
