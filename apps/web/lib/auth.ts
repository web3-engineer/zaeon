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

                const email = creds.email.trim().toLowerCase();
                const password = `${creds.password}`;

                const demoEmail = (process.env.DEMO_LOGIN || "").trim().toLowerCase();
                const demoPass  = process.env.DEMO_PASSWORD || "";
                const demoRole  = (process.env.DEMO_ROLE ?? "CLIENTE").toUpperCase();

                if (process.env.NODE_ENV === "development") {
                  console.log("[auth] has DEMO_LOGIN:", !!demoEmail, "has DEMO_PASSWORD:", !!demoPass, "role:", demoRole);
                }

                if (demoEmail && demoPass && email === demoEmail && password === demoPass) {
                  return { id: "user-demo", email: demoEmail, role: demoRole } as any;
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
        async redirect({ url, baseUrl }) {
            try {
              const target = new URL(url, baseUrl);
              if (target.origin === baseUrl) {
                // honra callbackUrl interno (ex: /dashboard/cliente)
                return target.pathname.startsWith("/") ? target.pathname + target.search : "/dashboard";
              }
            } catch {}
            return "/dashboard";
        },
    },
    pages: { signIn: "/login", error: "/login" },
};