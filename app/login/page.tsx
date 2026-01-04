'use client'
import { useEffect, useRef, useState } from "react";
import { Card, Button, Input } from "pixel-retroui";
import { Press_Start_2P } from 'next/font/google';
import { useUserContext } from '@/context/context';
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/stores/useUserStore";



const PressStartFont = Press_Start_2P({
    subsets: ['latin'],
    weight:'400'
})

export default function AuthPage() {

  const router = useRouter()
  const { currentUser, setCurrentUser, setIsFetchingDone, isFetchingDone} = useUserContext()
  const login = useUserStore(state => state.login);

  const [title, setTitle] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState(true);

  const counter = useRef(0);


  // displaying the page title with a typewriter effect
  useEffect(() => {
    if (isFetchingDone) {
      const authTitle:string = "Continue your journey";
      setTitle('C');
      const intervalId = setInterval(() => {
        if (isTyping) {
          if (!isTyping) return;
          setIsTyping(prev => !prev);
          setTitle(prev => prev + authTitle.charAt(counter.current));
          counter.current++;
          setIsTyping(prev => !prev);
          }
      }, 50);
      return () => clearInterval(intervalId);
    }
    
  }, [isFetchingDone]);
    
    async function submitHandler(e:any) {
      e.preventDefault();
      let email = (document.getElementById('email') as HTMLInputElement).value;
      let password = (document.getElementById('password') as HTMLInputElement).value;
      const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

      if (email === '' || password === '') {
        setError('Please fill out all the field.')
        return;
      } else if (!emailRegex.test(email)) {
        setError('Invalid email')
        return;
      };

      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers:{'content-type': 'application/JSON'},
        body: JSON.stringify({email: email.trim(), user_password:password.trim()})
      });

      const feedback = await response.json();

      if (feedback.success) {
        const userData = feedback.userData;
        // zustand function
        login({...userData});

        // context function
        setCurrentUser({...userData});
        !userData.profile_completed ? router.push('/characterCreation') : router.push('/journal');
      } else {
        setError("Unknown user");
      }
    }

  return (
    <div
      id="authWrapper"
      className="h-dvh w-full flex flex-col items-center"
    >
      <div className="h-[20%] flex flex-col justify-center my-5">
        <h2
          className={`
            mx-auto text-center 
            text-xl!
            sm:text-2xl!
            md:text-3xl!
            lg:text-4xl!
            xl:text-4xl!
            text-stone-300 
            ${PressStartFont.className}
          `}
        >
          {title}
        </h2>
      </div>

      <form
        className="
          flex
          flex-col
          gap-8
          min-h-80
          justify-center
          items-center
          w-[90%]
          sm:w-[90%]
          lg:w-[50%]
          xl:w-[50%]
          2xl:w-[50%]
          mx-auto
          mt-10
        "
      >
      

          <div className="w-[90%] mx-auto">
            <Input
              bg="black"
              textColor="white"
              borderColor="white"
              id="email"
              type="email"
              className="w-full focus:outline-none p-2 text-lg! sm:text-lg! md:text-lg! lg:text-xl! xl:text-2xl! 2xl:text-2xl!"
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

      
        <div className="w-[90%] flex flex-col items-center">
          <Button
            bg="black"
            textColor="white"
            borderColor="white"
            shadow="white"
            type="submit"
            className="w-full mt-5! py-2 text-lg! sm:text-lg! md:text-lg! lg:text-xl! xl:text-2xl! 2xl:text-2xl!"
            onClick={(e) => submitHandler(e)}
          >
            Resume my adventure
          </Button>
          <a href="/forgot" className="font-minecraft hover:underline! mt-5! ">
            Forgot password
          </a>
        </div>
      </form>

      <p className="font-minecraft mt-5! text-red-600">{error}</p>

      <div className="mt-8 flex flex-col space-y-2 text-sm">

        <a href="/signup" className="font-minecraft mb-5 hover:underline!">
          Create an account
        </a>
      </div>
    </div>
  );
}
