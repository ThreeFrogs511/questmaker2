"use client";
import { Button, Input } from "pixel-retroui";
import { useState } from "react";
import { loginUser } from "@/lib/auth/login";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { User } from "@/types/types";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../../public/fonts/retro_gaming.ttf' })

type FeedbackType = {
  success?: boolean;
  userData?: User;
  err?: string;
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputStyle =
    "w-full focus:outline-none text-sm! sm:text-lg! md:text-lg!";
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  async function submitHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    const inputEmail = email.trim();
    const inputPassword = password.trim();

    const feedback: FeedbackType = await loginUser(inputEmail, inputPassword);

    if (feedback.success && feedback.userData) {
      if (!feedback.userData.profile_completed) {
        router.push("/characterCreation");
      } else {
        login({ ...feedback.userData });
        router.push("/journal");
      }
    }

    if (feedback.err) {
      setError(feedback.err);
    }
  }

  return (
    <form
      className={`flex flex-col gap-8 min-h-80 items-center w-[90%] sm:w-[90%] lg:w-[50%] ${retroGaming.className}`}
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-[90%] mx-auto flex flex-col">
          <Input
            bg="black"
            textColor="white"
            borderColor="white"
            id="password"
            type="password"
            className={inputStyle}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <a
            href="/forgot"
            className="hover:underline! mt-2! text-xs text-center"
          >
            Forgot password ?
          </a>
        </div>
      </div>

      <Button
        formNoValidate
        bg="black"
        textColor="white"
        borderColor="white"
        shadow="white"
        type="submit"
        className="w-full p-2! mx-auto!"
      >
        Resume my adventure
      </Button>

      <div className="text-center h-20 md:mt-5! text-sm lg:text-base text-red-600">
        {error}
      </div>
    </form>
  );
}
