import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardIndex() {
    const session = await getServerSession(authOptions);

    // não logado? volta pro login
    if (!session) redirect("/login?callbackUrl=/dashboard");

    // role do usuário (vem do callback de session no auth.ts)
    const role = (session.user as any)?.role ?? "CLIENTE";

    if (role === "ADMIN")  redirect("/dashboard/admin");
    if (role === "ALUNO")  redirect("/dashboard/aluno");
    // padrão: cliente
    redirect("/dashboard/cliente");
}