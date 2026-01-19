'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
// import Loading from '@/context/loading';
import { useUserStore } from '@/stores/useUserStore';
import { useCharacterCreationStore } from '@/stores/useCharacterCreationStore';

type userContextType = {
    isFetchingDone: boolean
}

const UserDataContext = createContext<userContextType | null>(null);


export function UserDataProvider({children} :  { children: React.ReactNode }) {

    const router = useRouter();
    const pathname = usePathname();
    const login = useUserStore(state => state.login);
    const updateDraft = useCharacterCreationStore(state => state.updateDraft);
    const [isFetchingDone, setIsFetchingDone] = useState(false);
    
    useEffect(() => {
        fetch("/api/me")
            .then(r => r.json())
            .then(data => {

                // handling basic errors
                if (data.error) {
                    console.log("error:" + data.error); //handling the error
                    // pathname === '/signup' ? router.push("/signup") : router.push("/titleScreen");
                    // pathname === '/login' ? router.push("/login") : router.push("/titleScreen");
                    
                    // router.push('/titleScreen');
                    // trigger on
                    setIsFetchingDone(true);
                    return;
                };

                // successful fetch
                if (data.authenticated) {
                    // storing the user's data in the global object
                    login({...data.user});
                    console.log(data.user)
                    
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
    <UserDataContext.Provider value={{isFetchingDone}}>
        {/* {!isFetchingDone ? <Loading /> : children} */}
        {children}
    </UserDataContext.Provider>
    </>
    )
}

export function useUserContext() {
  const context = useContext(UserDataContext)
  if (!context) throw new Error("useUserContext must be used within UserProvider")
  return context;
}