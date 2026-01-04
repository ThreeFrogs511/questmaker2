'use client'
import { useState, useRef, useEffect} from 'react'
import { useUserContext } from '@/context/context'
import { Card, Button, Input } from 'pixel-retroui'
import { Press_Start_2P } from 'next/font/google'
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore'
import { useCharacterCreationStore } from '@/stores/useCharacterCreationStore'

const PressStartFont = Press_Start_2P({
    subsets: ['latin'],
    weight: '400'
})

export default function SignupPage() {

    const router = useRouter();
    const {setCurrentUser, isFetchingDone} = useUserContext();

    const updateDraft = useCharacterCreationStore(state => state.updateDraft);

    const [error, setError] = useState<string | undefined>()
    const [title, setTitle] = useState<string | undefined>('');
    const [isTyping, setIsTyping] = useState(true);
    const counter = useRef(0);

    // displaying the page title with a typewriter effect
    useEffect(() => {
        if (isFetchingDone) {
            const signUpTitle:string = "Your adventure begins now";
            setTitle('Y');
            const intervalId = setInterval(() => {
                if (!isTyping) return;
                if (isTyping) {
                    setIsTyping(prev => !prev);
                    setTitle(prev => prev + signUpTitle.charAt(counter.current));
                    counter.current++;
                    setIsTyping(prev => !prev);
                }
            }, 60);
            return () => clearInterval(intervalId);  
        }
    }, [isFetchingDone]);

    async function submitHandler(e: any) {
        e.preventDefault()
        setError('');
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirm = (document.getElementById('confirm') as HTMLInputElement).value;
        const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

        if (!email || !password || !confirm) {
            setError('All fields required');
            return;
        }

        if (!emailRegex.test(email)) {
            setError('Invalid email');
            return;
        }

        if (password !== confirm) {
            setError('Password mismatch')
            return;
        }

        if (!error) {
            const response = await fetch(`/api/users`, {
                method: 'POST',
                headers: {"content-type": "application/JSON"},
                body: JSON.stringify({
                    email: email.trim(), 
                    password: password.trim(), 
                })
            });
            const feedback = await response.json();
            if (feedback.success) {

                // zustand
                updateDraft({id: feedback.id, email: email.trim()});
                
                setCurrentUser(prev => ({...prev, id: feedback.id, email: email.trim()}));
                router.push('/characterCreation');
            } else {
                setError("error:" + feedback.err)
                console.log(feedback.error)
            }

        
        }
    };

    return (
        <div
            id="signupWrapper"
            className="h-dvh w-full flex flex-col items-center"
        >
            <div className='h-[20%] flex flex-col justify-center my-5'>
                <h2
                    className={`
                        mx-auto text-center 
                        text-xl!
                        sm:text-2xl!
                        md:text-3xl!
                        lg:text-4xl!
                        xl:text-4xl!
                        text-stone-300 
                        ${PressStartFont.className}`}>
                    {title}
                </h2>
            </div>

                <form
                    className="
                        flex
                        flex-col
                        gap-8
                        min-h-80
                        justify-between
                        w-[90%]
                        sm:w-[90%]
                        lg:w-[50%]
                        xl:w-[50%]
                        2xl:w-[50%]
                        mx-auto
                    "
                >
                    <div className="flex flex-col gap-6">
                        <div className="w-[90%] mx-auto">
                            <Input
                                bg="black"
                                textColor="white"
                                borderColor="white"
                                id="email"
                                type="email"
                                className="w-full focus:outline-none p-2 text-lg! sm:text-lg! md:text-lg! lg:text-xl! xl:text-2xl! 2xl:text-2xl! "
                                placeholder="Email"
                            />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <Input
                                bg="black"
                                textColor="white"
                                borderColor="white"
                                id="password"
                                type="password"
                                className="w-full focus:outline-none p-2 text-lg! sm:text-lg! md:text-lg! lg:text-xl! xl:text-2xl! 2xl:text-2xl!"
                                placeholder="Password"
                            />
                        </div>

                        <div className="w-[90%] mx-auto">
                             <Input
                                bg="black"
                                textColor="white"
                                borderColor="white"
                                id="confirm"
                                type="password"
                                className="w-full focus:outline-none p-2 text-lg! sm:text-lg! md:text-lg! lg:text-xl! xl:text-2xl! 2xl:text-2xl!"
                                placeholder="Confirm password"
                            />
                        </div>

                    </div>

                    <Button
                    bg="black"
                    textColor="white"
                    borderColor="white"
                    shadow="white"
                    type="submit"
                    className="w-[90%] mx-auto! lg:mb-5! xl:mb-15! lg:mt-5! xl:mt-5! 2xl:mt-10! py-2 text-lg! sm:text-lg! md:text-lg! lg:text-xl! xl:text-2xl! 2xl:text-2xl!"
                    onClick={(e) => submitHandler(e)}>
                        Begin my adventure
                    </Button>
                </form>

                <p className='font-minecraft mt-5! text-red-600'>{error}</p>

                <div className="mt-8 flex flex-col space-y-2 text-sm">
                    <a href="/login" className="font-minecraft mb-5 hover:underline!">
                        Already have an account
                    </a>
                </div>
 
        </div>
    )
}
