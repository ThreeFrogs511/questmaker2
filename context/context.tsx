"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore";
import fetchingQuests from "@/middlewares/fetchingQuests";
import { useJournalStore } from "@/stores/useJournalStore";
import { useInventoryStore } from "@/stores/useInventoryStore";


type userContextType = {
  isFetchingDone: boolean;
};

const UserDataContext = createContext<userContextType | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const login = useUserStore((state) => state.login);
  const updateDraft = useCharacterCreationStore((state) => state.updateDraft);
  const setIsMenuOpen = useUserStore((state) => state.setIsMenuOpen);
  const setAreQuestsLoaded = useJournalStore((state) => state.setAreQuestsLoaded);
  const updateInventory = useInventoryStore((state)=> state.updateInventory);
  const [isFetchingDone, setIsFetchingDone] = useState(false);

  useEffect(() => {
    fetch("/api/me", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pathname: pathname }),
    })
      .then((r) => r.json())
      .then((data) => {
        // console.log(data);
        //if the user is authenticated
        if (data.authenticated) {
          // handling existing but incomplete profile
          if (data.user.profile_completed === false) {
            updateDraft({ id: data.user.id, email: data.user.email });
            router.push("/characterCreation");
          } else {
            console.log('data:', data.user)
            login({ ...data.user });

            // handling quests and journal
            if (data.todos) {
              const listOrdered = data.todos.sort(
                (a: { id: number }, b: { id: number }) => b.id - a.id,
              );
              fetchingQuests(!listOrdered[0].body ? [] : listOrdered);
              setAreQuestsLoaded(true);
            };

            if (data.inventory) {
              updateInventory(data.inventory ?? []);
            }

            // redirecting to journal if on title screen or character creation
            if (pathname === "/" || pathname === "/characterCreation") {
              router.push("/journal");
            }

          }
        }

        //not authenticated
        if (data.err) {
          console.log("error:", data.err)
          if (pathname === "/signup") {
            router.push("/signup");
          } else if (pathname === "/login") {
            router.push("/login");
          } else {
            router.push("/titleScreen");
          }
        }
      })
      .catch((err) => {
        console.log(err)
        router.push("/titleScreen");
      })
      .finally(() => {
        setIsFetchingDone(true);
        // setIsMenuOpen(false);
      });
  }, [pathname, router, login, updateDraft, setIsMenuOpen, setAreQuestsLoaded, updateInventory]);

  return (
    <>
      <UserDataContext.Provider value={{ isFetchingDone }}>
        {isFetchingDone && children }
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
