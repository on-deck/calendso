import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import prisma from "../../../lib/prisma";
import { analytics, AnalyticsTrackingEvent } from "../../../lib/analytics";
import LaunchDarkly from "launchdarkly-node-server-sdk";

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SERVER_SDK_KEY);

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
            const userId = profile?.["https://beondeck.com/fellow_id"] as number;
            analytics.identify({ userId });

            await ldClient.waitForInitialization();
            const canCreateAccount = await ldClient.variation(
                "proj-feedback-hub",
                { key: String(userId) },
                false
            );
            await ldClient.close();

            if (!canCreateAccount) {
                analytics.track({
                    event: AnalyticsTrackingEvent.LoginNotAllowed,
                    userId,
                });
                throw new Error(
                    "On Deck Calendso is in closed beta right now. We've recorded your interest in it and will notify you once it's available."
                );
            }

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
                        username: String(userId),
                        id: userId,
                    },
                });
                analytics.track({
                    event: AnalyticsTrackingEvent.LoginFirstTime,
                    properties: { category: "Auth", action: "Signed Up" },
                    userId,
                });
            } else {
                analytics.track({
                    event: AnalyticsTrackingEvent.LoginSuccess,
                    properties: { category: "Auth", action: "Logged In" },
                    userId,
                });
            }

            return true;
        },
        async jwt(token, user, account, profile) {
            const userId = profile?.["https://beondeck.com/fellow_id"] as number;

            if (userId) {
                token.id = userId;
                token.username = userId;
            }

            return token;
        },
        async session(session, token) {
            session.user = session.user || {};
            (session.user as Record<string, unknown>).id = token.id;
            (session.user as Record<string, unknown>).username = token.username;
            return session;
        },
    },
});
