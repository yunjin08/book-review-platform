import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initApiWithAuth } from "@/lib/api-client";
import { config } from '@/config';
import { ApiProvider } from "@/components/auth/ApiProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Library ni Jed",
  description: "A library management system that allows you to manage your library.",
};

initApiWithAuth(config.api.baseURL);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ApiProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
          {children}
        </body>
      </ApiProvider>
    </html>
  );
}
