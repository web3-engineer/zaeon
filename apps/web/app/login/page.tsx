// app/dashboard/cliente/page.tsx
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default async function ClientePage() {
    // (Opcional) Aqui você pode usar getServerSession e proteger a rota
    return <ClientDashboard company="MMC Soluções" />;
}