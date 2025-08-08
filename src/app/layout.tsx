import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkClientProvider } from "@/providers/clerk-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Webloom - Website Builder & Project Management",
  description: "Build websites and manage projects with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkClientProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkClientProvider>
  );
}