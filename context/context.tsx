"use client";
import { createContext, useContext, useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore";
import prepareQuests from "@/lib/prepareQuests";
import { useJournalStore } from "@/stores/useJournalStore";
import { useInventoryStore } from "@/stores/useInventoryStore";

interface isDataLoadedType {
  isPlayerDataLoaded: boolean;
  isInventoryDataLoaded: boolean;
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
  const updateDraft = useCharacterCreationStore((state) => state.updateDraft);
  const setIsMenuOpen = useUserStore((state) => state.setIsMenuOpen);
  const setAreQuestsLoaded = useJournalStore(
    (state) => state.setAreQuestsLoaded,
  );
  const questsAreLoaded = useJournalStore((state) => state.areQuestsLoaded);
  const updateInventory = useInventoryStore((state) => state.updateInventory);

  // states for user data and fetching status
  const [isFetchingDone, setIsFetchingDone] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState<isDataLoadedType>({
    isPlayerDataLoaded: false,
    isInventoryDataLoaded: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);

  function isDatabaseQueryNecessary(pathname: string) {
    if (
      pathname === "/journal" &&
      questsAreLoaded &&
      isDataLoaded.isPlayerDataLoaded
    )
      return false;
    if ((pathname === "/characterSheet" || pathname==="/profileSettings") && isDataLoaded.isPlayerDataLoaded)
      return false;
    if (
      (pathname === "/inventory" || pathname.includes("/merchant")) &&
      isDataLoaded.isPlayerDataLoaded &&
      isDataLoaded.isInventoryDataLoaded
    ) {
      return false;
    }
    if (
      (pathname === "/campaignList" || pathname.includes("/campaignRunning")) &&
      isDataLoaded.isPlayerDataLoaded &&
      isDataLoaded.isInventoryDataLoaded
    ) {
      return false;
    }

  }

  useEffect(() => {
    const needQuery = isDatabaseQueryNecessary(pathname);
    if (needQuery === false) return; 

    fetch("/api/me", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pathname: pathname }),
    })
      .then((r) => r.json())
      .then((data) => {
        //if the user is authenticated
        if (data.authenticated) {
          // handling existing but incomplete profile

          console.log("data:", data.user);
          setIsProfileCompleted(true);
          login({ ...data.user });
          setIsDataLoaded((prev) => ({
            ...prev,
            isPlayerDataLoaded: true,
          }));

          // storing quests
          if (data.todos) {
            const listOrdered = data.todos.sort(
              (a: { id: number }, b: { id: number }) => b.id - a.id,
            );
            prepareQuests(!listOrdered[0].body ? [] : listOrdered);
            setAreQuestsLoaded(true);
          }

          //storing inventory
          if (data.inventory) {
            updateInventory(data.inventory ?? []);
            console.log("inventory data:", data.inventory);
            setIsDataLoaded((prev) => ({
              ...prev,
              isInventoryDataLoaded: true,
            }));
          }

          // // redirecting to journal if on title screen or character creation
          // if (pathname === "/" || pathname === "/characterCreation") {
          //   router.push("/journal");
          // }

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
        }
      })
      .catch((err) => {
        console.log("error:", err);
        router.push("/titleScreen");
      })
      .finally(() => {
        setIsFetchingDone(true);
      });
  }, [
    pathname,
    router,
    login,
    updateDraft,
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
