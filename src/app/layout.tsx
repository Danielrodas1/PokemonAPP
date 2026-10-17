import type { Metadata } from "next";
import Link from "next/link";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokédex | TanStack Query + Next.js",
  description: "Pokédex con RSC, prefetching en hover y caché de 24 horas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
            <Link href="/" className="text-xl font-bold text-red-600">
              Pokédex
            </Link>
          </div>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
