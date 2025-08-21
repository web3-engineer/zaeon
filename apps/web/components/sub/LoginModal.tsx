"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import CosmicLoader from "./CosmicLoader";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Mode = "login" | "signup";

export default function LoginModal({
                                       open,
                                       onClose,
                                   }: { open: boolean; onClose: () => void }) {
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const emailRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const titleId = "login-modal-title";

    // fecha modal e reseta estados voláteis
    const handleClose = () => {
        setLoading(false);
        setProgress(0);
        onClose();
    };

    // foco ao abrir
    useEffect(() => {
        if (open) {
            // pequena pausa para garantir montagem do DOM
            const t = setTimeout(() => emailRef.current?.focus(), 10);
            return () => clearTimeout(t);
        }
    }, [open]);

    // ESC para fechar
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                handleClose();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]); // handleClose é estável no runtime atual

    const fakeAuth = async () => {
        setLoading(true);
        for (let p = 0; p <= 100; p += 8) {
            setProgress(p);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 60));
        }
        const role = email.includes("admin")
            ? "admin"
            : email.includes("aluno")
                ? "aluno"
                : "cliente";
        router.push(`/dashboard/${role}`);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* backdrop (clique fora fecha) */}
                    <motion.div
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        aria-hidden
                    />

                    {/* dialog */}
                    <motion.div
                        className="fixed inset-0 z-[65] grid place-items-center px-4"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                    >
                        <div
                            className="relative w-full max-w-md rounded-2xl border border-[#7042f861]
                         bg-[#030014]/90 backdrop-blur p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                            tabIndex={-1}
                        >
                            {/* botão X */}
                            <button
                                type="button"
                                onClick={handleClose}
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
                                    void fakeAuth();
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

                                <button
                                    type="submit"
                                    className="w-full rounded-xl py-2.5 font-medium text-white
                             bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee]
                             hover:brightness-110 transition"
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

                    {loading && <CosmicLoader progress={progress} />}
                </>
            )}
        </AnimatePresence>
    );
}