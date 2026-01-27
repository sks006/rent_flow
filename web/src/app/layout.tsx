import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "RentFlow | Decentralized Rental Platform",
  description: "RentFlow is a decentralized rental platform built on Solana. Manage rentals, governance, and payments seamlessly on-chain.",
  keywords: ["RentFlow", "Solana", "DeFi", "Rental", "Blockchain"],
  authors: [{ name: "RentFlow Team" }],
  openGraph: {
    title: "RentFlow | Decentralized Rental Platform",
    description: "Manage rentals, governance, and payments seamlessly on-chain.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentFlow | Decentralized Rental Platform",
    description: "Manage rentals, governance, and payments seamlessly on-chain.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="theme-color" content="#0b1a31" />
      </head>
      <body className="custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
