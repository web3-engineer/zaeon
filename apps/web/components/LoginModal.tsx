"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import { BodyPortal, useLoginModal } from "@/app/state/login-modal";
import CosmicLoader from "@/components/CosmicLoader";

export default function LoginModal() {
    const { open, closeLogin } = useLoginModal();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const titleId = "login-modal-title";
    const router = useRouter();

    // foco ao abrir
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => emailRef.current?.focus(), 10);
        return () => clearTimeout(t);
    }, [open]);

    // ESC fecha
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                closeLogin();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, closeLogin]);

    // login com NextAuth (credentials)
    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        await new Promise<void>((r) => requestAnimationFrame(() => r()));

        const res = await signIn("credentials", {
            email,
            password: pass,
            redirect: false,
        });

        if (res?.error) {
            setLoading(false);
            setError("Credenciais inválidas.");
            return;
        }

        for (let p = 0; p <= 100; p += 6) {
            setProgress(p);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 40));
        }

        await new Promise((r) => setTimeout(r, 150));
        router.push("/dashboard"); // o server redireciona por role
    };

    // signup simples via API + login
    const handleSignup = async () => {
        setError(null);
        try {
            const resp = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass, role: "CLIENTE" }),
            });
            if (!resp.ok) {
                setError("Não foi possível criar a conta.");
                return;
            }
            await handleLogin();
        } catch {
            setError("Falha de rede ao criar a conta.");
        }
    };

    return (
        <BodyPortal>
            <AnimatePresence>
                {open && (
                    <>
                        {/* backdrop */}
                        <motion.div
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeLogin} aria-hidden
                        />
                        {/* dialog */}
                        <motion.div
                            className="fixed inset-0 z-[65] grid place-items-center px-4"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            role="dialog" aria-modal="true" aria-labelledby={titleId}
                        >
                            <div
                                className="relative w-full max-w-md rounded-2xl border border-[#7042f861]
                           bg-[#030014]/90 backdrop-blur p-6 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={closeLogin}
                                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
                                    aria-label="Fechar"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>

                                <div className="mb-6 text-center">
                                    <div className="text-sm text-[#b49bff]">ZAEON ACCESS</div>
                                    <h2 id={titleId} className="mt-1 text-2xl font-semibold text-white">
                                        {mode === "login" ? "Desbloquear agora" : "Criar uma conta"}
                                    </h2>
                                </div>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        // fecha “visual” por trás; loader cobre por cima
                                        closeLogin();
                                        if (mode === "login") void handleLogin();
                                        else void handleSignup();
                                    }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm text-zinc-300 mb-1">E‑mail</label>
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-lg bg-[#0b0f25] border border-[#343a55]
                                 text-white px-3 py-2 outline-none focus:border-cyan-400"
                                            placeholder="voce@zaeon.ai"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-zinc-300 mb-1">Senha</label>
                                        <input
                                            type="password"
                                            required
                                            value={pass}
                                            onChange={(e) => setPass(e.target.value)}
                                            className="w-full rounded-lg bg-[#0b0f25] border border-[#343a55]
                                 text-white px-3 py-2 outline-none focus:border-cyan-400"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    {error && <p className="text-sm text-red-400">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded-xl py-2.5 font-medium text-white
                               bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee]
                               hover:brightness-110 transition
                               disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {mode === "login" ? "Entrar" : "Criar conta"}
                                    </button>

                                    <div className="text-center text-sm text-zinc-300/80">
                                        {mode === "login" ? (
                                            <>
                                                Não tem conta?{" "}
                                                <button
                                                    type="button"
                                                    onClick={() => setMode("signup")}
                                                    className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                                                >
                                                    Criar usuário
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                Já tem conta?{" "}
                                                <button
                                                    type="button"
                                                    onClick={() => setMode("login")}
                                                    className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                                                >
                                                    Fazer login
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </motion.div>

                        {/* loader global por cima de tudo */}
                        {loading && <CosmicLoader progress={progress} />}
                    </>
                )}
            </AnimatePresence>
        </BodyPortal>
    );
}