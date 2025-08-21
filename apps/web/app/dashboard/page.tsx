import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardIndex() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role ?? "CLIENTE";

    if (role === "ADMIN") redirect("/dashboard/admin");
    if (role === "ALUNO") redirect("/dashboard/aluno");
    redirect("/dashboard/cliente");
}