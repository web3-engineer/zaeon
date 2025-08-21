"use client";
import { motion } from "framer-motion";

export default function CosmicLoader({ progress = 0 }: { progress?: number }) {
    // progress: 0..100
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const dash = (progress / 100) * circumference;

    const glyphs = "⟟⏚⋔⟟⌖⟊⟟⟟⨀⌖⋉⟊⨀⟟⌖⋉⟊⨀".split("");

    return (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 backdrop-blur">
            <div className="relative w-[220px] h-[220px]">
                {/* anel externo com glifos orbitando */}
                <motion.div
                    className="absolute inset-0 grid place-items-center"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 16 }}
                >
                    <div className="relative w-full h-full">
                        {glyphs.map((g, i) => {
                            const angle = (i / glyphs.length) * 2 * Math.PI;
                            const r = 95;
                            const x = 110 + r * Math.cos(angle);
                            const y = 110 + r * Math.sin(angle);
                            return (
                                <span
                                    key={i}
                                    className="absolute text-xs select-none"
                                    style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
                                >
                  <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent opacity-80">
                    {g}
                  </span>
                </span>
                            );
                        })}
                    </div>
                </motion.div>

                {/* círculo base */}
                <svg width="220" height="220" className="absolute inset-0">
                    <defs>
                        <linearGradient id="z" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke="#1f2937"
                        strokeWidth="10"
                        fill="none"
                        opacity="0.5"
                    />
                    <circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke="url(#z)"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeLinecap="round"
                        transform="rotate(-90 110 110)"
                        className="drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
                    />
                </svg>

                {/* porcentagem */}
                <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                        <div className="text-3xl font-semibold text-white">{Math.round(progress)}%</div>
                        <div className="text-xs text-cyan-200/70 tracking-[0.25em] mt-1">UNLOCKING</div>
                    </div>
                </div>
            </div>
        </div>
    );
}