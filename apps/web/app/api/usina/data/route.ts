// apps/web/app/api/usina/data/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

type DailyRow = { date: string; inj_kWh: number; cons_kWh: number };

const APP_ROOT = process.cwd(); // quando rodamos em apps/web, já aponta para apps/web
const MOCKS_DIR = path.join(APP_ROOT, "data/clients/mmc/mocks");

function onlyDigits(s: string) {
    return (s || "").replace(/\D+/g, "");
}

async function listMocks(): Promise<string[]> {
    try {
        const list = await fs.readdir(MOCKS_DIR, { withFileTypes: true });
        return list.filter(e => e.isFile() && /\.json$/i.test(e.name)).map(e => e.name);
    } catch {
        return [];
    }
}

async function loadClientMock(numeroCliente?: string): Promise<{file?: string; data: DailyRow[]}|null> {
    const digits = onlyDigits(numeroCliente || "");
    if (!digits) return null;

    const file = path.join(MOCKS_DIR, `${digits}.json`);
    try {
        const raw = await fs.readFile(file, "utf8");
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length) return { file: `${digits}.json`, data };
        return null;
    } catch {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const clientRaw = (searchParams.get("client") || "").trim();
        const debug = searchParams.get("debug") === "1";

        if (debug) {
            return NextResponse.json({
                ok: true,
                debug: {
                    clientRaw,
                    clientNormalized: onlyDigits(clientRaw),
                    mocksDir: MOCKS_DIR,
                    mocksAvailable: await listMocks(),
                },
            });
        }

        // MODO SÓ MOCK: ignora XLSX e sempre tenta o mock do cliente
        const mock = await loadClientMock(clientRaw);
        if (mock && mock.data.length) {
            return NextResponse.json({
                ok: true,
                source: "mock",
                file: mock.file,
                data: mock.data,
            });
        }

        // Fallback: devolve primeiro mock disponível (para nunca quebrar demo)
        const available = await listMocks();
        if (available.length > 0) {
            try {
                const any = available[0];
                const raw = await fs.readFile(path.join(MOCKS_DIR, any), "utf8");
                const data = JSON.parse(raw);
                if (Array.isArray(data) && data.length) {
                    return NextResponse.json({
                        ok: true,
                        source: "mock:alias",
                        file: any,
                        data,
                        note: `Mock do cliente solicitado (${clientRaw}) não encontrado; usando ${any}.`,
                    });
                }
            } catch {}
        }

        return NextResponse.json({
            ok: false,
            source: "empty",
            data: [],
            message: "Nenhum mock encontrado para este cliente.",
            hints: { expectedMockName: `${onlyDigits(clientRaw)}.json`, mocksDir: MOCKS_DIR },
        });
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
    }
}