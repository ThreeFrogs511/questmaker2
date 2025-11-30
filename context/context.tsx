'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import Loading from '@/context/loading';

type User = {
    id: number | null,
    username: string | null,
    email: string | null,
    hp: number | null,
    xp: number | null,
    dopamine: number | null,
    dopamine_consumed:number | null,
    gender: string | null
    user_class : string | null,
    race: string | null,
    lvl : number | null,
    str : number | null,
    dex : number | null,
    con : number | null,
    int : number | null,
    wis : number | null,
    cha : number | null,
    profile_completed : boolean,
    damage_taken: number
}

type userContextType = {
    currentUser: User,
    setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
    isFetchingDone: boolean,
    setIsFetchingDone: React.Dispatch<React.SetStateAction<boolean>>,

}

const UserDataContext = createContext<userContextType | null>(null);


export function UserDataProvider({children} :  { children: React.ReactNode }) {

    const router = useRouter();
    const pathname = usePathname();

    // global state, user data
    const [currentUser, setCurrentUser] = useState<User>({
        id: null, 
        username:null, 
        email:null, 
        xp:null, 
        hp:null, 
        dopamine: null,
        dopamine_consumed: 0,
        gender: null,
        user_class:null, 
        race:null,
        lvl:null,
        str :10,
        dex :10,
        con :10,
        int :10,
        wis :10,
        cha :10,
        profile_completed: false,
        damage_taken:0
    })

    
    const [isFetchingDone, setIsFetchingDone] = useState(false);
    
      useEffect(() => {
        fetch("/api/me")
            .then(r => r.json())
            .then(data => {

                // if we found an existing session, we automatically log the user back
                if (data.authenticated) {
                    // storing the user data in global state
                    setCurrentUser(data.user);

                    // if the account exists but no fully completed
                    if (!data.user.profile_completed) {
                        router.push('characterCreation')
                    } else {
                        pathname === '/' ? router.push('/journal') : router.push(`${pathname}`);
                    }
                } else {
                    pathname === '/signup' ? router.push("/signup") : router.push("/login");
                }

                if (data.err) {
                    console.log("error:" + data.err); 
                }
                setIsFetchingDone(true);
            });
    }, []);
    
    return(
    <>
    <UserDataContext.Provider value={{currentUser, setCurrentUser, isFetchingDone, setIsFetchingDone}}>
        {children}
  {!isFetchingDone && <Loading />}
    </UserDataContext.Provider>
    </>
    )
}

export function useUserContext() {
  const context = useContext(UserDataContext)
  if (!context) throw new Error("useUserContext must be used within UserProvider")
  return context;
}