import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { ChatWidget } from "@/components/ChatWidget/ChatWidget";
import { ThemeProvider } from "@/components/ThemeProvider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
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

const noFlashScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <BackgroundBlobs />
        <ThemeProvider>{children}</ThemeProvider>
        <ChatWidget />
      </body>
    </html>
  );
}
