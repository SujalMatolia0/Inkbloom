import type { Metadata } from "next";
import { Playfair_Display, Nunito, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/animation/Providers";
import { CustomCursor } from "@/components/ui/CustomCursor";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"]
});

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "600", "700"]
});

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["700", "800"]
});

export const metadata: Metadata = {
  title: "Inkbloom — Art & Craft Marketplace",
  description: "An immersive art experience — original paintings, custom commissions, and handmade goods.",
};

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${nunito.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CustomCursor />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
