import "@/lib/pixel-retroui-setup.js";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import RootLayoutClient from "@/components/global/RootLayoutClient";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start-2p",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pressStart2P.variable}>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
