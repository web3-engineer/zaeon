// components/dashboard/RecentInvoices.tsx
"use client";

import { Download, Loader } from "react-feather";

export type InvoiceStatus = "PAGA" | "ENVIADA" | "GERANDO...";

export type InvoiceRow = {
    id: string;
    ref: string;         // competência (ex: 2025-08)
    enelNumber: string;  // nº ENEL ou identificador interno
    inj_kWh: number;     // kWh injetado
    cons_kWh: number;    // kWh consumido
    saldo_kWh: number;   // saldo final de kWh (crédito/débito)
    amount_R$: number;   // valor final (R$) — pode ser 0 durante “GERANDO...”
    status: InvoiceStatus;
    pdfUrl?: string;     // link para baixar o PDF da fatura gerada
};

function currency(n: number) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function StatusPill({ status }: { status: InvoiceStatus }) {
    const map = {
        "PAGA":      "bg-green-500/15 text-green-300 ring-1 ring-green-500/30",
        "ENVIADA":   "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
        "GERANDO...":"bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
    } as const;

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${map[status]}`}>
      {status === "GERANDO..." && <Loader size={12} className="animate-spin" />}
            {status}
    </span>
    );
}

export default function RecentInvoices({ rows }: { rows: InvoiceRow[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#2b2f44]">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2b2f44]">
                    <thead className="bg-[#0e1530]">
                    <tr className="text-left text-xs uppercase tracking-wider text-zinc-400">
                        <th className="px-4 py-3">Competência</th>
                        <th className="px-4 py-3">Nº ENEL</th>
                        <th className="px-4 py-3">Inj. (kWh)</th>
                        <th className="px-4 py-3">Cons. (kWh)</th>
                        <th className="px-4 py-3">Saldo (kWh)</th>
                        <th className="px-4 py-3">Valor</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-[#2b2f44] bg-[#0a0f1e] text-sm">
                    {rows.map((r) => (
                        <tr key={r.id} className="hover:bg-[#0e1530]/50">
                            <td className="px-4 py-3 text-zinc-200">{r.ref}</td>
                            <td className="px-4 py-3 text-zinc-300">{r.enelNumber}</td>
                            <td className="px-4 py-3">{r.inj_kWh.toLocaleString("pt-BR")}</td>
                            <td className="px-4 py-3">{r.cons_kWh.toLocaleString("pt-BR")}</td>
                            <td className="px-4 py-3">{r.saldo_kWh.toLocaleString("pt-BR")}</td>
                            <td className="px-4 py-3 font-medium">
                                {r.status === "GERANDO..." ? "—" : currency(r.amount_R$)}
                            </td>
                            <td className="px-4 py-3">
                                <StatusPill status={r.status} />
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    {/* Baixar PDF — só habilita quando ENVIADA ou PAGA e pdfUrl existe */}
                                    <a
                                        href={r.pdfUrl ?? "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition
                        ${r.pdfUrl && (r.status === "ENVIADA" || r.status === "PAGA")
                                            ? "border-sky-500/40 text-sky-300 hover:bg-sky-500/10"
                                            : "pointer-events-none border-zinc-700/60 text-zinc-600"
                                        }
                      `}
                                        aria-disabled={!r.pdfUrl || (r.status === "GERANDO...")}
                                        title={r.pdfUrl ? "Baixar fatura (PDF)" : "Fatura indisponível"}
                                    >
                                        <Download size={14} />
                                        Baixar PDF
                                    </a>

                                    {/* Ação rápida — ex.: reenviar por e-mail (futuro) */}
                                    {/* Mantido como placeholder, se quiser esconder, remova */}
                                    {/* <button className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700/20">
                      Reenviar
                    </button> */}
                                </div>
                            </td>
                        </tr>
                    ))}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-zinc-400">
                                Nenhuma fatura encontrada para este cliente/período.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Rodapé opcional */}
            <div className="flex items-center justify-between gap-4 bg-[#0e1530] px-4 py-2 text-xs text-zinc-400">
                <span>Payout consolidado por competência. PDFs ficam disponíveis após “ENVIADA”.</span>
                {/* futura paginação/filtragem aqui, se quiser */}
            </div>
        </div>
    );
}