import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // ====== CLIENTE ======
    const clientEmail = "marcio@gmail.com";
    const clientPass  = "marcioadmin"; // você pode trocar depois
    const clientHash  = await bcrypt.hash(clientPass, 12);

    await prisma.user.upsert({
        where: { email: clientEmail },
        update: { role: "CLIENTE" },
        create: { email: clientEmail, password: clientHash, role: "CLIENTE" },
    });

    // ====== ADMIN (opcional) ======
    const adminEmail = "admin@zaeon.ai";
    const adminPass  = "admin123";
    const adminHash  = await bcrypt.hash(adminPass, 12);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: "ADMIN" },
        create: { email: adminEmail, password: adminHash, role: "ADMIN" },
    });

    console.log("Usuários prontos:");
    console.log(`CLIENTE → ${clientEmail} / ${clientPass}`);
    console.log(`ADMIN   → ${adminEmail} / ${adminPass}`);
}

main().finally(() => prisma.$disconnect());