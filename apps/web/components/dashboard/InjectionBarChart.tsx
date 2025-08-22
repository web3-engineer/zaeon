"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function InjectionBarChart({ data }: { data: { date: string; inj_kWh: number }[] }) {
    const chartData = data.slice(-14).map(d => ({ date: d.date.slice(5), inj: d.inj_kWh }));

    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 6, right: 6, top: 10, bottom: 0 }}>
                    <CartesianGrid stroke="#1a1e33" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ background: "#0a0f1e", border: "1px solid #2b2f44", borderRadius: 12 }}
                        labelStyle={{ color: "#e5e7eb" }}
                        itemStyle={{ color: "#cbd5e1" }}
                    />
                    <Bar dataKey="inj" stroke="#22d3ee" fill="#22d3ee" name="Injetado" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}