"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import prepareQuests from "@/lib/prepareQuests";
import { useJournalStore } from "@/stores/useJournalStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { useCombatStore } from "@/stores/useCombatStore";
import fetchAllData from "@/lib/me/fetchAllData";
import isDatabaseQueryNecessary from "@/lib/me/isDataQueryNecessary";

interface isDataLoadedType {
  isPlayerDataLoaded: boolean;
  isInventoryDataLoaded: boolean;
  isMovesetsDataLoaded:boolean;
  
}

interface userContextType {
  isFetchingDone: boolean;
  isProfileCompleted: boolean;
  isAuthenticated: boolean;
  isDataLoaded: isDataLoadedType;
}

const UserDataContext = createContext<userContextType | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const login = useUserStore((state) => state.login);
  const setIsMenuOpen = useUserStore((state) => state.setIsMenuOpen);
  const setAreQuestsLoaded = useJournalStore((state) => state.setAreQuestsLoaded,);
  const questsAreLoaded = useJournalStore((state) => state.areQuestsLoaded);
  const updateInventory = useInventoryStore((state) => state.updateInventory);
  const character = useCharacterStore((state)=> state.character)
  const hydrateCharacter = useCharacterStore((state) => state.hydrateCharacter);
  const hydrateMovesets = useCombatStore((state)=> state.hydrateMovesets);
  // states for user data and fetching status
  const [isFetchingDone, setIsFetchingDone] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState<isDataLoadedType>({
    isPlayerDataLoaded: false,
    isInventoryDataLoaded: false,
    isMovesetsDataLoaded:false
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);

  useEffect(() => {
    console.log("hp = ", character.hp)
  }, [character])

  useEffect(() => {
    const needQuery = isDatabaseQueryNecessary(pathname, isDataLoaded, questsAreLoaded);
    if (needQuery === false) return;
  
    new Promise<any>(async (resolve, reject) => {
      const data = await fetchAllData(pathname);
      resolve(data);
      reject(data);
    })
      .then((data) => {
        //if the user is authenticated
        if (data.authenticated) {
          // handling existing but incomplete profile

          console.log("data:", data);
          setIsProfileCompleted(true);
          login({ ...data.user });
          hydrateCharacter({...data.character});
          setIsDataLoaded((prev) => ({
            ...prev,
            isPlayerDataLoaded: true,
          }));

          // storing quests
          if (data.quests) {
   
            const listOrdered = data.quests.sort(
              (a: { quest_id: number }, b: { quest_id: number }) => b.quest_id - a.quest_id,
            );
            prepareQuests(!listOrdered[0].body ? [] : listOrdered);
            setAreQuestsLoaded(true);
          };

          //storing inventory
          if (data.inventory) {
            updateInventory(data.inventory ?? []);
            setIsDataLoaded((prev) => ({
              ...prev,
              isInventoryDataLoaded: true,
            }));
          };

          //storing movesets (skills)
          if (data.movesets) {
            hydrateMovesets(data.movesets);
            setIsDataLoaded((prev) => ({
              ...prev,
              isMovesetsDataLoaded:true
            }));
          };

          setIsAuthenticated(true);
        }

        //not authenticated
        if (data.err) {
          console.log("error:", data.err);
          if (pathname === "/signup") {
            router.push("/signup");
          } else if (pathname === "/login") {
            router.push("/login");
          } else {
            router.push("/titleScreen");
          }
        };
      })
      .catch((err) => {
        console.log("error:", err);
        router.push("/titleScreen");
      })
      .finally(() => {
        setIsFetchingDone(true);
      })
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
          isAuthenticated,
          isProfileCompleted,
          isDataLoaded,
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
