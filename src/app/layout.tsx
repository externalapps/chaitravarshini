import type { Metadata } from "next";
import { Fredoka, Baloo_2 } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ConfettiBackground from "@/components/ConfettiBackground";
// import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CV – Happy Birthday Chaitra 🎉",
  description: "A special birthday website for Chaitra Varshini with fun activities and games!",
  keywords: ["birthday", "Chaitra", "Varshini", "celebration", "games", "quiz"],
  authors: [{ name: "Birthday App" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ff6b9d",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff6b9d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CV Birthday" />
      </head>
      <body
        className={`${fredoka.variable} ${baloo2.variable} antialiased min-h-screen`}
      >
        {/* <ServiceWorkerRegistration /> */}
        <ConfettiBackground />
        <Navigation />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
