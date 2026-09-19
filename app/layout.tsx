import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEEE ITB Event Management",
  description: "Public event catalogue and admin management for IEEE ITB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

