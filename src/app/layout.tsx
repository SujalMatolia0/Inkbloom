import type { Metadata } from "next";
import { Playfair_Display, Nunito, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/animation/Providers";
import { CustomCursor } from "@/components/ui/CustomCursor";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vinyas — Mixed Media Studio by Anki Matolia",
  description: "Original mixed media art, custom commissions & handmade gifts from a soulful studio in Ratangarh, Rajasthan.",
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
