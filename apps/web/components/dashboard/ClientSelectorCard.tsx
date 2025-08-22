// components/dashboard/ClientSelectorCard.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ClientRecord } from "@/data/clients/types";
import { CLIENTS } from "@/data/clients/mmc/clients";
import { ChevronDown } from "react-feather";

type Props = {
    value: ClientRecord | null;
    onChange: (c: ClientRecord) => void;
};

type Pos = { top: number; left: number; width: number };

export default function ClientSelectorCard({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pos, setPos] = useState<Pos | null>(null);

    const cardRef = useRef<HTMLDivElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => setMounted(true), []);

    const recalc = () => {
        const btn = btnRef.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        setPos({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX, width: r.width });
    };

    useLayoutEffect(() => {
        recalc();
    }, []);

    useEffect(() => {
        if (!open) return;
        recalc();

        const onScroll = () => recalc();
        const onResize = () => recalc();
        const onDocClick = (e: MouseEvent) => {
            const t = e.target as Node;
            if (cardRef.current?.contains(t) || menuRef.current?.contains(t)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const handleSelect = (c: ClientRecord) => {
        onChange(c);
        setOpen(false);
        btnRef.current?.focus();
    };

    return (
        <div
            ref={cardRef}
            className="isolate rounded-2xl border border-[#2b2f44] bg-[#0a0f1e] p-4 flex flex-col"
            // isolate cria um stacking context local seguro
        >
            <label className="text-sm text-zinc-300 mb-2">Nº do Cliente</label>

            <button
                ref={btnRef}
                type="button"
                onClick={() => {
                    // sanidade: loga clique e tamanho da lista
                    console.log("btn click :: CLIENTS.len=", CLIENTS.length);
                    setOpen((v) => !v);
                }}
                className="pointer-events-auto w-full flex items-center justify-between rounded-lg border border-[#384057] bg-[#121832] hover:bg-[#151c37] transition-colors px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 relative z-[60]"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="truncate">{value?.numeroCliente ?? "Selecione..."}</span>
                <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {mounted && open && pos &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="listbox"
                        tabIndex={-1}
                        style={{
                            position: "fixed",
                            top: pos.top,
                            left: pos.left,
                            width: pos.width,
                        }}
                        className="z-[99999] max-h-64 overflow-auto rounded-xl border border-[#2b2f44] bg-[#0a0f1e]/95 backdrop-blur-md shadow-2xl"
                    >
                        {CLIENTS.map((c) => {
                            const active = c.id === value?.id;
                            return (
                                <button
                                    key={c.id}
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => handleSelect(c)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${active ? "bg-[#1b2340] text-white" : "text-zinc-200 hover:bg-[#151c37]"}
                  `}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{c.numeroCliente}</span>
                                        <span className="text-xs text-zinc-400 ml-2">Usina {c.usina}</span>
                                    </div>
                                    {c.nome && (
                                        <div className="text-xs text-zinc-400 mt-0.5 truncate">{c.nome}</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>,
                    document.body
                )}
        </div>
    );
}