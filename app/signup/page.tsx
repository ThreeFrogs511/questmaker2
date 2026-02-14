"use client";
import { useState, useRef, useEffect } from "react";
import { useUserContext } from "@/context/context";
import { Button, Input } from "pixel-retroui";
import { Press_Start_2P } from "next/font/google";
import { useRouter } from "next/navigation";
import { useCharacterCreationStore } from "@/stores/useCharacterCreationStore";

const PressStartFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function SignupPage() {
  const router = useRouter();
  const { isFetchingDone } = useUserContext();

  const updateDraft = useCharacterCreationStore((state) => state.updateDraft);

  const [error, setError] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>("");
  const [isTyping, setIsTyping] = useState(true);
  const counter = useRef(-1);

  const inputStyle =
    "w-full focus:outline-none text-sm! sm:text-lg! md:text-lg!";

  // displaying the page title with a typewriter effect
  useEffect(() => {
    if (isFetchingDone) {
      const signUpTitle: string = "Your adventure begins now";
      const intervalId = setInterval(() => {
        if (!isTyping) return;
        if (isTyping) {
          setIsTyping((prev) => !prev);
          setTitle((prev) => prev + signUpTitle.charAt(counter.current));
          counter.current++;
          setIsTyping((prev) => !prev);
        }
      }, 60);
      return () => clearInterval(intervalId);
    }
  }, [isFetchingDone, isTyping]);

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const confirm = (document.getElementById("confirm") as HTMLInputElement)
      .value;

    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: { "content-type": "application/JSON" },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
        confirm: confirm.trim(),
      }),
    });
    const feedback = await response.json();

    if (feedback.success) {
      // zustand
      updateDraft({ id: feedback.id, email: email.trim() });
      router.push("/characterCreation");
    }

    if (feedback.err) {
      setError(feedback.err);
      console.log("voici l'erreur", feedback.err);
    }
  }

  return (
    <div
      id="signupWrapper"
      className="h-full! w-full flex flex-col justify-evenly gap-0 md:gap-2 items-center"
    >
      <div className="h-[20%] flex flex-col justify-center my-5">
        <h2
          className={`
                        mx-auto text-center 
                        text-xl!
                        sm:text-2xl!
                        text-stone-300 
                        ${PressStartFont.className}`}
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
                        items-center
                        w-[90%]
                        sm:w-[90%]
                        lg:w-[50%]
                    "
        onSubmit={submitHandler}
      >
        <div className="w-full flex flex-col gap-6">
          <div className="w-[90%] mx-auto">
            <Input
              bg="black"
              textColor="white"
              borderColor="white"
              id="email"
              type="email"
              className={inputStyle}
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
              className={inputStyle}
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
              className={inputStyle}
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
          className="w-full p-2! mx-auto!"
        >
          Begin my adventure
        </Button>
      </form>

      <p className="font-minecraft text-center h-20 md:mt-5! text-sm lg:text-base text-red-600">
        {error}
      </p>

      <div className="mb-5 ">
        <a href="/login" className="font-minecraft text-sm underline!">
          Sign in →
        </a>
      </div>
    </div>
  );
}
