import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { StaticNavbar } from "@/components/server/StaticNavbar";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chakra-petch'
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
    <html lang="en" className={`${chakraPetch.variable} ${chakraPetch.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-neon-blue/30 selection:text-white">
        <StaticNavbar />
        {children}
      </body>
    </html>
  );
}
