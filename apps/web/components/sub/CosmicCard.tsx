// src/components/CosmicCard.tsx
"use client";
import { ReactNode } from "react";

type Props = {
    title: string;
    icon?: ReactNode;
    children?: ReactNode;
    ctaLabel?: string;
    onCta?: () => void;
    variant?: "defi" | "refi" | "edfi";
    fast?: boolean;
};

export default function CosmicCard({
                                       title,
                                       icon,
                                       children,
                                       ctaLabel = "Saiba mais",
                                       onCta,
                                       variant = "defi",
                                       fast = false,
                                   }: Props) {
    return (
        <article
            className="zaeon-card p-6 md:p-8 rounded-2xl border bg-[#0300145e] backdrop-blur
                 h-full flex flex-col justify-between"
            data-variant={variant}
            data-fast={fast ? "true" : "false"}
        >
            {/* topo: ícone em moldura fixa */}
            {icon && (
                <div className="mb-6 flex items-center justify-center">
                    <div className="size-36 md:size-40 lg:size-44 grid place-items-center rounded-xl zaeon-grid">
                        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain">
                            {icon}
                        </div>
                    </div>
                </div>
            )}

            {/* conteúdo */}
            <div className="space-y-2">
                <h3 className="text-white text-xl md:text-2xl font-semibold leading-tight">{title}</h3>
                <div className="text-zinc-300 text-sm md:text-base leading-relaxed">
                    {children}
                </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
                <button
                    onClick={onCta}
                    className="rounded-full px-5 py-2.5 text-sm font-medium
                     bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee]
                     text-white/95 hover:text-white transition
                     shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                >
                    {ctaLabel}
                </button>
            </div>
        </article>
    );
}