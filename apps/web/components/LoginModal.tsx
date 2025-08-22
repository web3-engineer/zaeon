// components/LoginModal.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
};

export default function LoginModal({ open, onOpenChange }: Props) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);

    // foco e ESC para fechar
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => emailRef.current?.focus(), 10);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
        window.addEventListener("keydown", onKey);
        return () => {
            clearTimeout(t);
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onOpenChange]);

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setErr(null);
            setLoading(true);

            const res = await signIn("credentials", {
                email,
                password: pass,
                redirect: false,
            });

            if (res?.error) {
                setLoading(false);
                setErr("Credenciais inválidas.");
                return;
            }

            // sucesso
            onOpenChange(false);
            router.replace("/dashboard"); // server decide /cliente | /admin | /aluno
        },
        [email, pass, router, onOpenChange]
    );

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center"
            role="dialog"
            aria-modal="true"
            onClick={() => onOpenChange(false)} // fecha no backdrop
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-md rounded-2xl border border-[#7042f861] bg-[#030014]/90 p-6 shadow-2xl text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                    onClick={() => onOpenChange(false)}
                    aria-label="Fechar"
                    type="button"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold mb-1">Desbloquear agora</h2>
                <p className="text-sm text-zinc-300 mb-4">Acesse seu painel Zaeon</p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-1">E‑mail</label>
                        <input
                            ref={emailRef}
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-[#0b0f25] border border-[#343a55] text-white px-3 py-2 outline-none focus:border-cyan-400"
                            placeholder="cliente@zaeon.ai"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-300 mb-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full rounded-lg bg-[#0b0f25] border border-[#343a55] text-white px-3 py-2 outline-none focus:border-cyan-400"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    {err && <p className="text-sm text-red-400">{err}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl py-2.5 font-medium text-white
                       bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee]
                       hover:brightness-110 transition
                       disabled:opacity-60"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}