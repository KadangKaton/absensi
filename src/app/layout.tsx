import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nana Bouquet — Daftar Hadir",
  description: "Selamat datang di Nana Bouquet! Silakan tuliskan nama Anda sebagai tanda kehadiran.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
