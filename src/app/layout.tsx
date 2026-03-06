import type { Metadata } from "next";
import { Chakra_Petch, Atma } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { StaticNavbar } from "@/components/server/StaticNavbar";
import { A11yProvider } from "@/components/client/A11yProvider";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra-petch'
});

const atma = Atma({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-atma'
});

export const metadata: Metadata = {
  title: "Beamlines Outreach",
  description: "Interactive particle physics and astrophysics outreach curriculum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${chakraPetch.variable} ${atma.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-neon-blue/30 selection:text-white">
        <A11yProvider />
        <StaticNavbar />
        {children}
      </body>
    </html>
  );
}
