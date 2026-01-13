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

                // handling basic errors
                if (data.error) {
                    console.log("error:" + data.error); //handling the error
                    pathname === '/signup' ? router.push("/signup") : router.push("/login");
                    // trigger on
                    setIsFetchingDone(true);
                    return;
                };

                // successful fetch
                if (data.authenticated) {
                    // storing the user's data in the global object
                    login({...data.user});
                    
                    // handling existing but incomplete profile
                    if (!data.user.profile_completed) {
                        updateDraft({id:data.user.id, email:data.user.email});
                        router.push('/characterCreation');
                    } else {
                        pathname === '/' ? router.push('/journal') : router.push(`${pathname}`);
                    }
                };
                // trigger on
                setIsFetchingDone(true);
            })

            // catching and handling other errors
            .catch(err => {
                console.log("error : " + err);
                pathname === '/signup' ? router.push("/signup") : router.push("/login");
                // trigger on
                setIsFetchingDone(true);
                return;
            });
    }, []);
    
    return(
    <>
    <UserDataContext.Provider value={{currentUser, setCurrentUser, isFetchingDone, setIsFetchingDone}}>
        {!isFetchingDone ? <Loading /> : children}
    </UserDataContext.Provider>
    </>
    )
}

export function useUserContext() {
  const context = useContext(UserDataContext)
  if (!context) throw new Error("useUserContext must be used within UserProvider")
  return context;
}