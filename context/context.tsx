"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
// import Loading from '@/context/loading';
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore";

type userContextType = {
  isFetchingDone: boolean;
};

const UserDataContext = createContext<userContextType | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const login = useUserStore((state) => state.login);
  const updateDraft = useCharacterCreationStore((state) => state.updateDraft);
  const [isFetchingDone, setIsFetchingDone] = useState(false);


  useEffect(() => {
    console.log("fonction context activée");
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          // handling existing but incomplete profile
          if (!data.user.profile_completed) {
            updateDraft({ id: data.user.id, email: data.user.email });
            router.push("/characterCreation");
          } else {
            login({ ...data.user });
            // pathname ==='/characterCreation' && router.push("/journal");
            console.log(data.user);
          }
        }

        if (data.err) {
          if (pathname === "/signup") {
            router.push("/signup");
          } else if (pathname === "/login") {
            router.push("/login");
          } else {
            router.push("/titleScreen");
          }
        };
      })
      .catch(() => {
        router.push("/titleScreen");
      })
      .finally(() => {
        setIsFetchingDone(true);
      });
  }, [login, pathname, updateDraft, router]);

  return (
    <>
      <UserDataContext.Provider value={{ isFetchingDone }}>
        {isFetchingDone && children}
      </UserDataContext.Provider>
    </>
  );
}

export function useUserContext() {
  const context = useContext(UserDataContext);
  if (!context)
    throw new Error("useUserContext must be used within UserProvider");
  return context;
}
