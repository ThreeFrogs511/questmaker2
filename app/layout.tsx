"use client";
import "@/lib/pixel-retroui-setup.js";
import "./globals.css";
import { UserDataProvider } from "@/context/context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <html lang="en">
      <body>
        <UserDataProvider>
          <div className="px-3! max-w-400 w-full! mx-auto h-dvh! overflow-x-hidden">
            {children}
          </div>
        </UserDataProvider>
      </body>
    </html>
  );
}
