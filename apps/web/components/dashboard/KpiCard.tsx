export default function KpiCard({
                                    title,
                                    value,
                                    hint,
                                }: { title: string; value: string; hint?: string }) {
    return (
        <div className="rounded-2xl border border-[#2b2f44] bg-[#0a0f1e] p-4">
            <div className="text-sm text-zinc-300">{title}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
            {hint && <div className="mt-1 text-xs text-zinc-400">{hint}</div>}
        </div>
    );
}