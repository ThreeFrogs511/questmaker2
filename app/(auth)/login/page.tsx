import LoginForm from "@/components/auth/login/LoginForm";
import TypeWriterTitle from "@/components/auth/TypewriterTitle";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../../public/fonts/retro_gaming.ttf' })

export default function LoginPage() {
  const title = "Continue your journey";
  return (
    <div
      id="loginWrapper"
      className={`h-full! w-full flex flex-col justify-evenly gap-0 md:gap-2 items-center ${retroGaming.className}`}
    >
      <div className="h-[20%] flex flex-col justify-center my-5">
        

        <TypeWriterTitle string={title}/>
      </div>

      <LoginForm />

      <div className="mb-5">
        <a href="/signup" className="text-sm underline!">
          Create an account →
        </a>
      </div>
    </div>
  );
}
