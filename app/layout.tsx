import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "IEEE ITB Events", template: "%s | IEEE ITB" },
  description: "Public event catalogue and admin management for IEEE ITB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
