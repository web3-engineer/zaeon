export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs"; // <- força Node runtime

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };