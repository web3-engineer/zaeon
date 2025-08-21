const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
    const email = "cliente@zaeon.ai";
    const pass  = "cliente123";         // troque depois
    const hash  = await bcrypt.hash(pass, 12);

    await prisma.user.upsert({
        where: { email },
        update: { role: "CLIENTE" },
        create: { email, password: hash, role: "CLIENTE" },
    });

    console.log("Cliente criado:", email, "senha:", pass);
}

main().then(()=>prisma.$disconnect()).catch(e=>{console.error(e);process.exit(1);});