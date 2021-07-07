import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import prisma from "../../../lib/prisma";

export default NextAuth({
    session: {
        jwt: true,
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error", // Error code passed in query string as ?error=
    },
    providers: [
        Providers.Auth0({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            domain: process.env.AUTH0_DOMAIN,
        }),
    ],
    callbacks: {
        async signIn(user, account, profile) {
            const calendsoUser = await prisma.user.findFirst({
                where: {
                    email: user.email,
                },
            });

            if (!calendsoUser) {
                await prisma.user.create({
                    data: {
                        avatar: user.image,
                        name: user.name,
                        email: user.email,
                        emailVerified: new Date(),
                        username: String(profile["https://beondeck.com/fellow_id"]),
                    },
                });
            }

            return true;
        },
        async jwt(token, user, account, profile) {
            // Add username to the token right after signin
            if (user?.username) {
                token.id = user.id;
                token.username = user.username;
            }
            if (profile?.["https://beondeck.com/fellow_id"]) {
                const calendsoUser = await prisma.user.findFirst({
                    where: {
                        email: user.email,
                    },
                });

                token.id = calendsoUser.id;
                token.username = String(profile["https://beondeck.com/fellow_id"]);
            }
            return token;
        },
        async session(session, token) {
            session.user = session.user || {};
            session.user.id = token.id;
            session.user.username = token.username;
            return session;
        },
    },
});
