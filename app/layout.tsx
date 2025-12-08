'use client'
import '@/lib/pixel-retroui-setup.js';
import './globals.css'
import { UserDataProvider } from '@/context/context';




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  





  return (
      <html lang="en">
        <body>
          <UserDataProvider>
          <div className=" px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 2xl:px-60 max-w-[1600px] mx-auto h-dvh!">
            {children}
          </div>
          </UserDataProvider>
        </body>
      </html>
   
  )
}