"use client";
import { Button, Input } from "pixel-retroui";
import { loginUser } from "@/lib/auth/login";
import { useRouter } from "next/navigation";
import { User } from "@/types/types";
import localFont from "next/font/local";
import { useActionState, useEffect } from "react";
import { useJournalStore } from "@/stores/useJournalStore";
import Form from "next/form";
const retroGaming = localFont({
  src: "../../../public/fonts/retro_gaming.ttf",
});

type FeedbackType = {
  success?: boolean;
  userData?: User;
  err?: string;
};

export default function LoginForm() {

  const router = useRouter();

  const allQuests = useJournalStore((state) => state.allQuests);

  async function submitHandler(
    previousState: { email: string; password: string; err: string },
    formData: FormData,
  ): Promise<{ email: string; password: string; err: string }> {
    const inputEmail = formData.get("email") as string;
    const inputPassword = formData.get("password") as string;

    try {
      const feedback: FeedbackType = await loginUser(inputEmail, inputPassword);

      if (feedback.success && feedback.userData) {
        if (!feedback.userData.profile_completed) {
          router.push("/characterCreation");
        } else if (
          feedback.userData.profile_completed &&
          !feedback.userData.tutorial_completed
        ) {
          router.push("/intro");
        } else {
          router.push("/journal");
        }
      }

      if (feedback.err) {
        return { email: inputEmail, password: "", err: feedback.err };
      }
    } catch (err) {
      console.log((err as Error).message);
      return {
        email: inputEmail,
        password: "",
        err: "An unexpected error occurred. Please try again.",
      };
    }

    return { email: inputEmail, password: "", err: "" };
  }

  const [formState, loginAction, isPending] = useActionState(submitHandler, {
    email: "",
    password: "",
    err: "",
  });

  useEffect(() => {
    console.log("all quests = ", allQuests)
  }, [allQuests])


  return (
    <Form
      className={`flex flex-col gap-8 min-h-80 items-center w-[90%] sm:w-[90%] lg:w-[50%] ${retroGaming.className}`}
      action={loginAction}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="w-[90%] mx-auto">
          <Input
            bg="black"
            textColor="white"
            borderColor="white"
            id="email"
            name="email"
            type="email"
            defaultValue={formState?.email}
            className="w-full focus:outline-none text-sm! sm:text-lg! md:text-lg!"
            placeholder="Email"
          />
        </div>

        <div className="w-[90%] mx-auto flex flex-col">
          <Input
            bg="black"
            textColor="white"
            borderColor="white"
            id="password"
            name="password"
            type="password"
            defaultValue={""}
            className="w-full focus:outline-none text-sm! sm:text-lg! md:text-lg!"
            placeholder="Password"
          />
          {/* <a
            href="/forgot"
            className="hover:underline! mt-2! text-xs text-center"
          >
            Forgot password ?
          </a> */}
        </div>
      </div>

      <Button
        formNoValidate
        bg="black"
        textColor="white"
        borderColor="white"
        shadow="white"
        type="submit"
        disabled={isPending}
        className="w-full p-2! mx-auto!"
      >
        {isPending ? "Loading..." : "Resume my adventure"}
      </Button>

      <div className="text-center h-20 md:mt-5! text-sm lg:text-base text-red-600">
        {formState.err}
      </div>
    </Form>
  );
}
