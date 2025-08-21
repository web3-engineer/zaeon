import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarsCanvas from "@/components/main/StarBackground";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
import { LoginModalProvider } from "@/app/state/login-modal";
import LoginModal from "@/components/LoginModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zaeon",
  description: "This is my portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}
      >
        <LoginModalProvider>
          <StarsCanvas />
          <Navbar />
          {children}
          <Footer />
          <LoginModal />
        </LoginModalProvider>
      </body>
    </html>
  );
}
