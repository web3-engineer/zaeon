// lib/usina/parseXlsx.ts
import path from "node:path";
import fs from "node:fs";
import * as XLSX from "xlsx";

export type DailyRow = {
    date: string;      // ISO yyyy-mm-dd
    inj_kWh: number;
    cons_kWh: number;
    value_R$: number;  // estimativa (inj * tarifa)
};

const TARIFA_R$ = 0.79; // ajuste se quiser

function toISO(d: any): string {
    if (d instanceof Date && !isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }
    if (typeof d === "string") {
        const m = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // dd/mm/aaaa
        if (m) return `${m[3]}-${m[2]}-${m[1]}`;
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    }
    return String(d);
}

export function readUsinaXlsx(monthSlug: string = "jun"): DailyRow[] {
    // Caminho: data/clients/mmc/injected/<mês>/usina-injecao.xlsx
    const dir = path.join(
        process.cwd(),
        "data",
        "clients",
        "mmc",
        "injected",
        monthSlug
    );
    const file = path.join(dir, "usina-injecao.xlsx");

    if (!fs.existsSync(file)) {
        // tenta qualquer .xlsx na pasta do mês
        if (fs.existsSync(dir)) {
            const anyXlsx = fs.readdirSync(dir).find(f => f.toLowerCase().endsWith(".xlsx"));
            if (anyXlsx) {
                const alt = path.join(dir, anyXlsx);
                return parseFile(alt);
            }
        }
        return [];
    }
    return parseFile(file);
}

function parseFile(file: string): DailyRow[] {
    const wb = XLSX.readFile(file);
    const wsName = wb.SheetNames[0];
    const ws = wb.Sheets[wsName];
    const rows = XLSX.utils.sheet_to_json<any>(ws, { defval: null });

    const out: DailyRow[] = [];
    for (const r of rows) {
        const dateRaw = r.Date ?? r.date ?? r.DATA;
        const injRaw  = r.Injection_kWh ?? r.inj_kWh ?? r.INJ ?? r.Inj ?? r.Injeção ?? r["Injeção (kWh)"];
        const consRaw = r.Consumption_kWh ?? r.cons_kWh ?? r.CONS ?? r.Cons ?? r.Consumo ?? r["Consumo (kWh)"];

        if (!dateRaw) continue;

        const date = toISO(dateRaw);
        const inj = Number(injRaw ?? 0);
        const cons = Number(consRaw ?? 0);
        const value = inj * TARIFA_R$;
        out.push({ date, inj_kWh: inj, cons_kWh: cons, value_R$: value });
    }
    out.sort((a, b) => a.date.localeCompare(b.date));
    return out;
}