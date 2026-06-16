"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import prepareQuests from "@/lib/quests/prepareQuests";
import { useJournalStore } from "@/stores/useJournalStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useCombatStore } from "@/stores/useCombatStore";
import fetchAllData from "@/lib/me/fetchAllData";

interface isDataLoadedType {
  isPlayerDataLoaded: boolean;
  isInventoryDataLoaded: boolean;
  isMovesetsDataLoaded: boolean;
}

interface userContextType {
  isFetchingDone: boolean;
};

const UserDataContext = createContext<userContextType | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const login = useUserStore((state) => state.login);
  const setIsMenuOpen = useUserStore((state) => state.setIsMenuOpen);
  const setAreQuestsLoaded = useJournalStore(
    (state) => state.setAreQuestsLoaded,
  );
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const hydrateCharacter = useCharacterStore((state) => state.hydrateCharacter);
  const hydrateMovesets = useCombatStore((state) => state.hydrateMovesets);
  // states for user data and fetching status
  const [isFetchingDone, setIsFetchingDone] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState<isDataLoadedType>({
    isPlayerDataLoaded: false,
    isInventoryDataLoaded: false,
    isMovesetsDataLoaded: false,
  });

  useEffect(() => {
    if (
      isDataLoaded.isPlayerDataLoaded &&
      isDataLoaded.isInventoryDataLoaded &&
      isDataLoaded.isMovesetsDataLoaded
    ) {
      return;
    }

    fetchAllData(pathname)
      .then((data) => {
        if (data.authenticated) {
          // console.log("data:", data);
          login({ ...data.user });
          hydrateCharacter({ ...data.character });
          updateInventory(data.inventory ?? []);
          hydrateMovesets(data.movesets ?? []);
          setIsDataLoaded({
            isPlayerDataLoaded: true,
            isInventoryDataLoaded: true,
            isMovesetsDataLoaded: true,
          });
        }

        if (data.err) {
          // console.log("error:", data.err);
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
        // console.log("error:", err);
        router.push("/titleScreen");
      })
      .finally(() => {
        setIsFetchingDone(true);
      });
  }, [
    pathname,
    router,
    login,
    setIsMenuOpen,
    setAreQuestsLoaded,
    updateInventory,
  ]);

  return (
    <>
      <UserDataContext.Provider
        value={{
          isFetchingDone,
        }}
      >
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
