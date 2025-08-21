import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, password, role } = await req.json();
        if (!email || !password) {
            return new Response("Email e senha são obrigatórios", { status: 400 });
        }
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) return new Response("Usuário já existe", { status: 409 });

        const hash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, password: hash, role: role ?? "CLIENTE" },
        });

        return Response.json({ id: user.id, email: user.email });
    } catch {
        return new Response("Erro ao registrar", { status: 500 });
    }
}