"use client";
import { Button, Input } from "pixel-retroui";
import { useActionState } from "react";
import { signupUser } from "@/lib/auth/signup";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import Form from "next/form";

const retroGaming = localFont({
  src: "../../../public/fonts/retro_gaming.ttf",
});

type FeedbackType = {
  success?: boolean;
  err?: string;
  id?: number;
};

export default function SignupForm() {
  const router = useRouter();

  async function submitHandler(
    previousState: {
      email: string;
      password: string;
      confirm: string;
      err: string;
    },
    formData: FormData,
  ): Promise<{
    email: string;
    password: string;
    confirm: string;
    err: string;
  }> {
    const inputEmail = (formData.get("email") as string).trim();
    const inputPassword = (formData.get("password") as string).trim();
    const inputConfirm = (formData.get("confirm") as string).trim();

    try {
      const feedback: FeedbackType = await signupUser(
        inputEmail,
        inputPassword,
        inputConfirm,
      );

      if (feedback.success) {
        router.push("/characterCreation");
      }

      if (feedback.err) {
        return {
          email: inputEmail,
          password: inputPassword,
          confirm: inputConfirm,
          err: feedback.err,
        };
      }
      return {
        email: "",
        password: "",
        confirm: "",
        err: "",
      };
    } catch (err) {
      return {
        email: inputEmail,
        password: inputPassword,
        confirm: inputConfirm,
        err: "An unexpected error occurred. Please try again.",
      };
    }
  }

  const [formState, signUpAction, isPending] = useActionState(submitHandler, {
    email: "",
    password: "",
    confirm: "",
    err: "",
  });

  return (
    <Form
      className={`flex flex-col gap-8 min-h-80 items-center w-[90%] sm:w-[90%] lg:w-[50%] ${retroGaming.className}`}
      action={signUpAction}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="w-[90%] mx-auto">
          <Input
            bg="black"
            textColor="white"
            borderColor="white"
            id="email"
            type="email"
            name="email"
            className="w-full focus:outline-none text-sm! sm:text-lg! md:text-lg!"
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
            name="password"
            className="w-full focus:outline-none text-sm! sm:text-lg! md:text-lg!"
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
            name="confirm"
            className="w-full focus:outline-none text-sm! sm:text-lg! md:text-lg!"
            placeholder="Confirm password"
          />
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
        {isPending ? "Loading..." : "Begin my adventure"}
      </Button>

      <div className="text-center h-20 md:mt-5! text-sm lg:text-base text-red-600">
        {formState.err}
      </div>
    </Form>
  );
}
