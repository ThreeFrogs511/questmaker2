import "@/lib/pixel-retroui-setup.js";
import "./globals.css";
import localFont from 'next/font/local';
import RootLayoutClient from "@/components/global/RootLayoutClient";


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
