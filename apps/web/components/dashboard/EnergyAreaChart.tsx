"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function EnergyAreaChart({ data }: { data: { date: string; inj_kWh: number; cons_kWh: number; }[] }) {
    const chartData = data.map(d => ({
        date: d.date.slice(5), // MM-DD
        inj: d.inj_kWh,
        cons: d.cons_kWh,
    }));

    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: 6, right: 6, top: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="inj" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="cons" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1a1e33" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ background: "#0a0f1e", border: "1px solid #2b2f44", borderRadius: 12 }}
                        labelStyle={{ color: "#e5e7eb" }}
                        itemStyle={{ color: "#cbd5e1" }}
                    />
                    <Area type="monotone" dataKey="inj" stroke="#22d3ee" fill="url(#inj)" name="Injetado" />
                    <Area type="monotone" dataKey="cons" stroke="#8b5cf6" fill="url(#cons)" name="Consumo" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}