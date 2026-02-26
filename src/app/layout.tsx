import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IP Ramp Open Source — Patent Ideation for Software Teams",
  description:
    "Open source patent ideation platform. Discover patentable ideas, apply inventive frameworks, score Alice eligibility, and draft claims — all locally, no backend required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
