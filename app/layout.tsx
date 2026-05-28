import "@/lib/pixel-retroui-setup.js";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import localFont from 'next/font/local';
import RootLayoutClient from "@/components/global/RootLayoutClient";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start-2p",
});

const retroGaming = localFont({
  src: '../public/fonts/retro_gaming.ttf',
  variable: '--font-retro-gaming',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={retroGaming.variable}>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
