"use client";
import { UserDataProvider } from "@/context/context";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserDataProvider>
      <div className="px-2! max-w-400 w-full! mx-auto h-dvh! overflow-x-hidden">
        {children}
      </div>
    </UserDataProvider>
  );
}
