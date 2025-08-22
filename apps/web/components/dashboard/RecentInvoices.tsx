function StatusPill({ s }: { s: "PAGA" | "EM ABERTO" | "CRÉDITO" }) {
    const map = {
        "PAGA":    "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
        "EM ABERTO": "bg-amber-500/15 text-amber-300 border-amber-400/30",
        "CRÉDITO": "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    } as const;
    return (
        <span className={`text-xs px-2 py-1 rounded-full border ${map[s]}`}>{s}</span>
    );
}

export default function RecentInvoices({
                                           rows,
                                       }: {
    rows: {
        id: string;
        ref: string;
        enelNumber: string;
        inj_kWh: number;
        cons_kWh: number;
        saldo_kWh: number;
        amount_R$: number;
        status: "PAGA" | "EM ABERTO" | "CRÉDITO";
    }[];
}) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="text-zinc-300">
                <tr className="border-b border-[#2b2f44]">
                    <th className="text-left py-2 pr-2">Competência</th>
                    <th className="text-left py-2 pr-2">Fatura ENEL</th>
                    <th className="text-right py-2 pr-2">Inj (kWh)</th>
                    <th className="text-right py-2 pr-2">Cons (kWh)</th>
                    <th className="text-right py-2 pr-2">Saldo (kWh)</th>
                    <th className="text-right py-2 pr-2">Valor</th>
                    <th className="text-left py-2 pr-2">Status</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((r) => (
                    <tr key={r.id} className="border-b border-[#20243a] hover:bg-white/5">
                        <td className="py-2 pr-2">{r.ref}</td>
                        <td className="py-2 pr-2">{r.enelNumber}</td>
                        <td className="py-2 pr-2 text-right">{r.inj_kWh.toLocaleString("pt-BR")}</td>
                        <td className="py-2 pr-2 text-right">{r.cons_kWh.toLocaleString("pt-BR")}</td>
                        <td className="py-2 pr-2 text-right">{r.saldo_kWh.toLocaleString("pt-BR")}</td>
                        <td className={`py-2 pr-2 text-right ${r.amount_R$ < 0 ? "text-cyan-300" : "text-zinc-200"}`}>
                            {r.amount_R$.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </td>
                        <td className="py-2 pr-2"><StatusPill s={r.status} /></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}