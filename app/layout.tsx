import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pranav-portfolio.0121210.xyz"),
  title: {
    default: "Pranav Babu — AI Engineer",
    template: "%s | Pranav Babu — AI Engineer",
  },
  description:
    "Portfolio of Pranav Babu — AI Engineer building production AI tools, agentic systems, and RAG pipelines. Currently at Hykon India Limited.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pranav-portfolio.0121210.xyz",
    siteName: "Pranav Babu — AI Engineer",
    title: "Pranav Babu — AI Engineer",
    description:
      "Portfolio of Pranav Babu — AI Engineer building production AI tools, agentic systems, and RAG pipelines. Currently at Hykon India Limited.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Babu — AI Engineer",
    description:
      "Portfolio of Pranav Babu — AI Engineer building production AI tools, agentic systems, and RAG pipelines. Currently at Hykon India Limited.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
