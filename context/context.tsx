'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import Loading from '@/context/loading';
import { User } from '@/types/types';
import { useUserStore } from '@/stores/useUserStore';
import { useCharacterCreationStore } from '@/stores/useCharacterCreationStore';

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

    const login = useUserStore(state => state.login);

    const updateDraft = useCharacterCreationStore(state => state.updateDraft);

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
        ac:null,
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
                    login({...data.user});
                    // if the account exists but no fully completed
                    if (!data.user.profile_completed) {
                        updateDraft({id:data.user.id, email:data.user.email});
                        router.push('characterCreation');
                        
                    } else {
                        pathname === '/' ? router.push('/journal') : router.push(`${pathname}`);
                        // pathname==='/characterCreation'&& router.push('/journal');
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