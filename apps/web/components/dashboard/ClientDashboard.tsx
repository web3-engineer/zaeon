// components/dashboard/ClientDashboard.tsx
"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import EnergyAreaChart from "./EnergyAreaChart";
import InjectionBarChart from "./InjectionBarChart";
import KpiCard from "./KpiCard";
import RecentInvoices from "./RecentInvoices";
import ClientSelectorCard from "./ClientSelectorCard";
import type { ClientRecord } from "@/data/clients/types";
import { CLIENTS } from "@/data/clients/mmc/clients";

// ----------------------
// D A D O S   M O C K
// ----------------------
type Daily = {
  date: string;     // ISO
  inj_kWh: number;  // energia injetada (kWh)
  cons_kWh: number; // energia consumida (kWh)
  value_R$: number; // valor gerado pela usina (R$)
};

type Invoice = {
  id: string;
  ref: string;       // competência (ex: 2025-07)
  enelNumber: string;
  inj_kWh: number;
  cons_kWh: number;
  saldo_kWh: number;
  amount_R$: number; // positivo = pagar / negativo = crédito
  status: "PAGA" | "ENVIADA" | "GERANDO...";
  pdfUrl?: string;
};

const MOCK_DAILY: Daily[] = [
  { date: "2025-07-01", inj_kWh: 210, cons_kWh: 260, value_R$: 175.3 },
  { date: "2025-07-02", inj_kWh: 205, cons_kWh: 240, value_R$: 170.1 },
  { date: "2025-07-03", inj_kWh: 180, cons_kWh: 230, value_R$: 150.9 },
  { date: "2025-07-04", inj_kWh: 220, cons_kWh: 250, value_R$: 182.6 },
  { date: "2025-07-05", inj_kWh: 235, cons_kWh: 240, value_R$: 190.2 },
  { date: "2025-07-06", inj_kWh: 240, cons_kWh: 245, value_R$: 194.8 },
  { date: "2025-07-07", inj_kWh: 260, cons_kWh: 255, value_R$: 207.3 },
  { date: "2025-07-08", inj_kWh: 270, cons_kWh: 260, value_R$: 214.6 },
  { date: "2025-07-09", inj_kWh: 265, cons_kWh: 262, value_R$: 210.8 },
  { date: "2025-07-10", inj_kWh: 250, cons_kWh: 258, value_R$: 201.1 },
  { date: "2025-07-11", inj_kWh: 245, cons_kWh: 252, value_R$: 197.9 },
  { date: "2025-07-12", inj_kWh: 230, cons_kWh: 248, value_R$: 186.4 },
  { date: "2025-07-13", inj_kWh: 225, cons_kWh: 240, value_R$: 182.2 },
  { date: "2025-07-14", inj_kWh: 215, cons_kWh: 238, value_R$: 175.9 },
  { date: "2025-07-15", inj_kWh: 210, cons_kWh: 236, value_R$: 172.4 },
  { date: "2025-07-16", inj_kWh: 205, cons_kWh: 230, value_R$: 169.0 },
  { date: "2025-07-17", inj_kWh: 220, cons_kWh: 232, value_R$: 180.1 },
  { date: "2025-07-18", inj_kWh: 245, cons_kWh: 240, value_R$: 197.2 },
  { date: "2025-07-19", inj_kWh: 260, cons_kWh: 244, value_R$: 208.5 },
  { date: "2025-07-20", inj_kWh: 275, cons_kWh: 248, value_R$: 220.7 },
  { date: "2025-07-21", inj_kWh: 280, cons_kWh: 250, value_R$: 224.4 },
  { date: "2025-07-22", inj_kWh: 290, cons_kWh: 255, value_R$: 232.0 },
  { date: "2025-07-23", inj_kWh: 300, cons_kWh: 258, value_R$: 240.1 },
  { date: "2025-07-24", inj_kWh: 295, cons_kWh: 262, value_R$: 236.7 },
  { date: "2025-07-25", inj_kWh: 285, cons_kWh: 260, value_R$: 228.9 },
  { date: "2025-07-26", inj_kWh: 260, cons_kWh: 258, value_R$: 210.6 },
  { date: "2025-07-27", inj_kWh: 255, cons_kWh: 254, value_R$: 206.7 },
  { date: "2025-07-28", inj_kWh: 250, cons_kWh: 250, value_R$: 202.5 },
  { date: "2025-07-29", inj_kWh: 245, cons_kWh: 248, value_R$: 198.2 },
  { date: "2025-07-30", inj_kWh: 240, cons_kWh: 246, value_R$: 194.1 },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv_2025_06",
    ref: "2025-06",
    enelNumber: "ENEL-938271",
    inj_kWh: 6700,
    cons_kWh: 7200,
    saldo_kWh: 500,
    amount_R$: 212.45,
    status: "PAGA",
    pdfUrl: "https://example.com/faturas/2025-06.pdf",
  },
  {
    id: "inv_2025_07",
    ref: "2025-07",
    enelNumber: "ENEL-948622",
    inj_kWh: 7200,
    cons_kWh: 7000,
    saldo_kWh: 700,
    amount_R$: 185.1,
    status: "ENVIADA",
    pdfUrl: "https://example.com/faturas/2025-07.pdf",
  },
  {
    id: "inv_2025_08",
    ref: "2025-08",
    enelNumber: "ENEL-955103",
    inj_kWh: 7050,
    cons_kWh: 7300,
    saldo_kWh: 450,
    amount_R$: 0,
    status: "GERANDO...",
  },
];

function currency(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ClientDashboard({ company }: { company: string }) {
  // Começa já com o primeiro cliente selecionado (mantém tudo visível)
  const [client, setClient] = useState<ClientRecord | null>(CLIENTS[0]);
  const [days] = useState(30);

  // Por enquanto, usamos o mesmo mock para todos; quando ligar o backend,
  // basta trocar dailyData conforme o client.id/usina.
  const dailyData = MOCK_DAILY;

  const { injTotal, consTotal, valueTotal, injAvgDay } = useMemo(() => {
    const slice = dailyData.slice(-days);
    const inj = slice.reduce((s, d) => s + d.inj_kWh, 0);
    const cons = slice.reduce((s, d) => s + d.cons_kWh, 0);
    const val = slice.reduce((s, d) => s + d.value_R$, 0);
    const avg = inj / (slice.length || 1);
    return { injTotal: inj, consTotal: cons, valueTotal: val, injAvgDay: avg };
  }, [days, dailyData]);

  const last = dailyData[dailyData.length - 1];

  return (
    <main className="min-h-screen w-full px-6 md:px-10 py-8 text-white">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Dashboard — {company}</h1>
        <p className="text-sm text-zinc-300">
          Atualizado em {format(new Date(last.date), "dd/MM/yyyy")}
        </p>
      </header>

      {/* ======== KPIs (KPI #1 é o seletor de cliente) ======== */}
      <section className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {/* KPI 1: Card de seleção de cliente */}
        <ClientSelectorCard value={client} onChange={setClient} />

        {/* KPI 2 */}
        <KpiCard title="Consumo (30d)" value={`${consTotal.toFixed(0)} kWh`} hint="Consumo medido" />

        {/* KPI 3 */}
        <KpiCard title="Valor gerado (30d)" value={currency(valueTotal)} hint="Estimativa de geração R$" />

        {/* KPI 4 */}
        <KpiCard title="Média diária injetada" value={`${injAvgDay.toFixed(0)} kWh/dia`} hint="Produção média dos últimos 30 dias" />
      </section>

      {/* ======== Gráficos ======== */}
      <section className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#2b2f44] bg-[#0a0f1e] p-4">
          <h3 className="text-lg font-medium mb-2">Injeção × Consumo (kWh)</h3>
          <EnergyAreaChart data={dailyData} />
        </div>
        <div className="rounded-2xl border border-[#2b2f44] bg-[#0a0f1e] p-4">
          <h3 className="text-lg font-medium mb-2">Injeção diária (kWh)</h3>
          <InjectionBarChart data={dailyData} />
        </div>
      </section>

      {/* ======== Faturas ENEL / Compensações ======== */}
      <section className="mt-8">
        <div className="rounded-2xl border border-[#2b2f44] bg-[#0a0f1e] p-4">
          <h3 className="text-lg font-medium mb-4">Faturas & Compensações</h3>
          <RecentInvoices rows={MOCK_INVOICES} />
        </div>
      </section>
    </main>
  );
}