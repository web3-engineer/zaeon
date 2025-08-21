// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
// Se já tiver prisma importado, ok; se não, comente por enquanto
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
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

                // ---- DEMO MODE: valida contra NEXT_PUBLIC_* (sem DB) ----
                const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
                const demoPass  = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
                const demoRole  = (process.env.NEXT_PUBLIC_DEMO_ROLE ?? "CLIENTE").toUpperCase();

                if (demoEmail && demoPass) {
                    if (creds.email === demoEmail && creds.password === demoPass) {
                        return { id: "demo-user", email: demoEmail, role: demoRole };
                    }
                }

                // ---- Fluxo normal (DB) — será usado depois ----
                try {
                    const user = await prisma.user.findUnique({ where: { email: creds.email } });
                    if (!user) return null;
                    const ok = await bcrypt.compare(creds.password, user.password);
                    if (!ok) return null;
                    return { id: user.id, email: user.email, role: user.role };
                } catch {
                    return null;
                }
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
    pages: {
        signIn: "/login",
        error: "/login",
    },
};