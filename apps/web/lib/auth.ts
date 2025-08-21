// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(creds) {
                if (!creds?.email || !creds?.password) return null;

                // Usuário “oficial” via .env (sem DB)
                const demoEmail = process.env.DEMO_LOGIN;
                const demoPass  = process.env.DEMO_PASSWORD;
                const demoRole  = (process.env.DEMO_ROLE ?? "CLIENTE").toUpperCase();

                if (demoEmail && demoPass &&
                    creds.email === demoEmail && creds.password === demoPass) {
                    return { id: "user-demo", email: demoEmail, role: demoRole };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) (token as any).role = (user as any).role ?? "CLIENTE";
            return token;
        },
        async session({ session, token }) {
            (session.user as any).role = (token as any).role ?? "CLIENTE";
            return session;
        },
    },
    pages: { signIn: "/login", error: "/login" },
};