
import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Dancing_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/configs/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeueCertificate = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const dancingScriptCertificate = Dancing_Script({
  variable: "--font-dancing-script",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticketing",
  description: "A modern e-ticketing platform.",
};



export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeueCertificate.variable} ${dancingScriptCertificate.variable} antialiased`}
      >
          <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
          </Providers>
            
      </body>
    </html>
  );
}
