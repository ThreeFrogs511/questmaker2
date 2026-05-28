import TypeWriterTitle from "@/components/auth/TypewriterTitle";
import SignupForm from "@/components/auth/signup/SignupForm";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../../public/fonts/retro_gaming.ttf' })

export default function Signup() {
 
  const title = "Your adventure begins now";
  return (
    <div
      id="signupWrapper"
      className={`h-full! w-full flex flex-col justify-evenly gap-0 md:gap-2 items-center ${retroGaming.className}`}
    >
      <div className="h-[20%] flex flex-col justify-center my-5">
        <TypeWriterTitle string={title}/>
      </div>

      <SignupForm />


      <div className="mb-5 ">
        <a href="/login" className="text-sm underline!">
          Log in →
        </a>
      </div>
    </div>
  );
}
