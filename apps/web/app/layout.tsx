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
      <body className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden`}>
      <LoginModalProvider>
        {/* Create a stacking context so the starfield sits BEHIND everything */}
        <div className="relative min-h-screen">
          {/* Background stars; stays behind thanks to z-0 and pointer-events-none */}
          <div className="absolute inset-0 z-0">
            <StarsCanvas debug={false} />
          </div>

          {/* Foreground content */}
          <div className="relative z-10">
            <Navbar />
            {children}
            <Footer />
            <LoginModal />
          </div>
        </div>
      </LoginModalProvider>
      </body>
      </html>
  );
}
