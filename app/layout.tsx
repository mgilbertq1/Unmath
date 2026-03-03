import type { Metadata, Viewport } from "next";
import { Cinzel_Decorative, Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import AppShell from "@/components/AppShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Unmath — Belajar Seru",
  description: "Platform belajar Matematika & PPKn SMA interaktif",
  keywords: ["matematika", "ppkn", "belajar", "game", "edukasi", "sma"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F6F1E9",
};

import { Agentation } from "agentation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${cormorant.variable} ${cinzel.variable}`}>
      <body className="font-body antialiased cultural-theme">
        <AuthProvider>
          <AppShell>
            {children}
            {process.env.NODE_ENV === "development" && <Agentation />}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
