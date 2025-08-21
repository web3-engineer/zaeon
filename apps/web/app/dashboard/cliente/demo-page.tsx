"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function DemoLoginPage() {
    const [busy, setBusy] = useState(false);

    async function handleDemo() {
        if (busy) return;
        setBusy(true);
        await signIn("credentials", {
            email: process.env.NEXT_PUBLIC_DEMO_EMAIL,
            password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
            redirect: true,
            callbackUrl: "/dashboard", // o server redireciona por role
        });
        setBusy(false);
    }

    return (
        <main className="min-h-screen grid place-items-center p-6 bg-[#030014]">
            <div className="w-full max-w-md rounded-2xl border border-[#7042f861] bg-[#0b0f25]/80 backdrop-blur p-6 text-white">
                <h1 className="text-2xl font-semibold mb-4">Acesso Demo — Zaeon</h1>
                <p className="text-sm text-zinc-300 mb-6">
                    Clique para entrar com credenciais de demonstração e visualizar seu dashboard.
                </p>
                <button
                    onClick={handleDemo}
                    disabled={busy}
                    className="w-full rounded-xl py-2.5 font-medium text-white
                     bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee]
                     hover:brightness-110 transition
                     disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {busy ? "Abrindo..." : "Entrar como cliente demo"}
                </button>

                <div className="mt-4 text-xs text-zinc-400">
                    Precisa de login manual? Use <code>{process.env.NEXT_PUBLIC_DEMO_EMAIL}</code> /
                    <code> {process.env.NEXT_PUBLIC_DEMO_PASSWORD}</code> em <a className="underline" href="/login">/login</a>.
                </div>
            </div>
        </main>
    );
}