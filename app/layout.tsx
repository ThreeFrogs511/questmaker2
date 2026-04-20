import "@/lib/pixel-retroui-setup.js";
import "./globals.css";
import RootLayoutClient from "@/components/global/RootLayoutClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
