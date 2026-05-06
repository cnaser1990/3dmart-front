import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Mart | فروشگاه محصولات سه‌بعدی",
  description: "خرید محصولات پرینت سه‌بعدی و مواد مصرفی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}