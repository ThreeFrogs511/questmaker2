'use client'
import useSound from "use-sound";
import { useEffect, useState} from "react";
import { useUserContext } from "@/context/context";
import List from "@/components/journal/List";
import Toolbar from "@/components/journal/Toolbar"
import { Press_Start_2P } from 'next/font/google';
import ProgressBar from '@/components/userStats/ProgressBar'
import Footer from "@/components/global/Footer"
import Header from "@/components/global/Header"



const PressStartFont = Press_Start_2P({
      subsets: ['latin'],
      weight:'400'
  });

export default function journal() {

  const { currentUser, isFetchingDone} = useUserContext();

  type List = {
    id: number | null,
    body: string | null,
    completed:boolean | null,
    list: string | null
  }

  // warns us when the quests are all fetched
  const [areQuestsLoaded, setAreQuestsLoaded] = useState(false);

  // the complete list of quests, unfiltered
  const [allQuests, setAllQuests] = useState<Array<List> | null>(null);

  // the displayed quests list, with filters depending on the journal page
  const [displayedQuests, setDisplayedQuests] = useState<Array<List> | null >(null);
  
  // determines the journal page and triggers the quests lists filters
  const [whichPage, setWhichPage] = useState<number>(0); 
  const journal = ['Current quests', 'Archived quests', 'All quests'];

  const [changingPageSound] = useSound('/sounds/blipSelect.wav');


  const fetchingTodos = async () => {
      const id = currentUser.id;
      const response = await fetch(`/api/todo/${id}`);
      const originalList= await response.json();
      !originalList.error && setAllQuests(originalList);

      // displaying only current quests as default display
      if (!originalList.error) {
        const currentQuests = originalList.filter((n: { completed: boolean; }) => n.completed === false)
        setDisplayedQuests(currentQuests);
      }
      // quests fetching is done
      setAreQuestsLoaded(true);
    
  };



    
  // fetching data at rendering
  useEffect(() => {
    currentUser.id && fetchingTodos();
  }, [isFetchingDone]);


  // sorting list based on the page number
  useEffect(() => {
    changingPageSound();

    if (allQuests) {
      if (whichPage === 0) {
        const currentQuests = allQuests.filter(n => n.completed === false)
        setDisplayedQuests(currentQuests);
      } else if (whichPage === 1) {
        const archivedQuests = allQuests.filter(n => n.completed === true)
        setDisplayedQuests(archivedQuests);
      } else if (whichPage === 2) {
        setDisplayedQuests(allQuests);
      }
    }
  }, [whichPage])


  const updatingXp = async () => {
     if (currentUser) {
       const response = await fetch(`/api/xp/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: currentUser.xp, column: 'xp' }),
      });

      if (!response.ok) {
        console.error('Erreur PATCH', await response.text());
        return;
      } 
    }
  }


   return(
    <>
    <div className="wrapper">
      <Header />
      <section id="todo-list">
        <div id='journal-navigation' className="flex justify-between items-center mb-3">
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-10 cursor-pointer" 
          onClick={() => setWhichPage(prev => prev ===0 ? 2 : prev-1)}> 
            <path d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2h12zM10 7H8v2h2V7zm0 0h2V5h-2v2zm0 10H8v-2h2v2zm0 0h2v2h-2v-2z" 
            fill="currentColor"/> 
          </svg>
          <h2 
            className={`col-span-1 text-center text-xs! lg:text-2xl! text-stone-300 ${PressStartFont.className}`}>
              {journal[whichPage]}
          </h2>
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-10 cursor-pointer"
          onClick={() => setWhichPage(prev => prev ===2 ? 0 : prev+1)}> 
            <path d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z" 
            fill="currentColor"/> 
          </svg>
        </div>

          {/* toolbar */}
        <Toolbar 
          setDisplayedQuestsAction={setDisplayedQuests}  
          setAllQuestsAction={setAllQuests} 
          setWhichPageAction={setWhichPage}
          whichPage={whichPage}/>

          {/* list of quests */}
        { areQuestsLoaded ? 
          <List 
            displayedQuests={displayedQuests} 
            setDisplayedQuestsAction={setDisplayedQuests} 
            allQuests={allQuests}
            setAllQuestsAction={setAllQuests}
            whichPage={whichPage} /> 
            : 
          <div className="w-full h-full  max-h-full! flex justify-center mt-50 font-minecraft text-base lg:text-2xl! ">
            Loading quests...
          </div>
        }
      </section>
      <Footer />
    </div>
    </>
  )

}