'use client'
import useSound from 'use-sound';
import { Press_Start_2P } from 'next/font/google';
import { Button, Card, Input } from 'pixel-retroui';
import { useUserContext } from '@/context/context';

import Quest from '@/classes/Quest';

const PressStartFont = Press_Start_2P({
      subsets: ['latin'],
      weight:'400'
  });


 type List = {
    id: number | null,
    body: string | null,
    completed:boolean | null,
    list: string | null
  }

export default function Toolbar({setDisplayedQuestsAction, setAllQuestsAction, 
    setWhichPageAction, whichPage} : {
    setDisplayedQuestsAction: React.Dispatch<React.SetStateAction<Array<List> | null>>,
    setAllQuestsAction: React.Dispatch<React.SetStateAction<Array<List> | null>>,
    setWhichPageAction: React.Dispatch<React.SetStateAction<number>>,
    whichPage: number
}) {   

    const {currentUser} = useUserContext();

    async function submitToDoClick() {
        const value = (document.getElementById('todo') as HTMLInputElement).value;
        if (value && currentUser.id) {
                const quest = new Quest();
                const feedback = await quest.insert(value, currentUser.id);
                if (feedback.success) {
                    setAllQuestsAction((prev) => [feedback.quest, ...(prev ?? [])]);
                    (document.getElementById('todo') as HTMLInputElement).value = '';
                    whichPage === 0 ? setDisplayedQuestsAction((prev) => [feedback.quest, ...(prev ?? [])]) : setWhichPageAction(0);
                } else {
                    console.log(feedback.error)
                }
        }
    }
    
    return(
        <>
            <div className='flex h-10 mb-5 pl-1'>
                <Input 
                bg="black"
                textColor="white"
                borderColor="white"
                type="text" 
                id="todo" 
                placeholder="Your quest..." 
                maxLength={300}
                className={` grow h-full ${PressStartFont.className} placeholder:${PressStartFont.className}`}
                />

                {/* submit button */}
                <Button
                bg="black"
                textColor="white"
                borderColor="white"
                className='w-1/10 h-full text-lg '
                onClick={() => submitToDoClick()}>
                    +
                </Button>
            </div>
        </>
    )
}