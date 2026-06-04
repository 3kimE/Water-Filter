import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Filtre Maroc — Filtres à eau & osmose inverse au Maroc",
    template: "%s | Filtre Maroc",
  },
  description:
    "Filtres à eau, systèmes d'osmose inverse, fontaines et solutions semi-industrielles. Livraison partout au Maroc. Paiement à la livraison.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${poppins.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-white text-ink antialiased"
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
