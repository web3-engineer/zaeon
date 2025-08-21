export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/dashboard/:path*"], // protege tudo que começa com /dashboard
};