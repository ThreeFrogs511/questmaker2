import LoginForm from "@/components/auth/login/LoginForm";
import TypeWriterTitle from "@/components/auth/TypewriterTitle";
export default function LoginPage() {
  const title = "Continue your journey";
  return (
    <div
      id="loginWrapper"
      className="h-full! w-full flex flex-col justify-evenly gap-0 md:gap-2 items-center"
    >
      <div className="h-[20%] flex flex-col justify-center my-5">
        

        <TypeWriterTitle string={title}/>
      </div>

      <LoginForm />

      <div className="mb-5">
        <a href="/signup" className="font-minecraft text-sm underline!">
          Create an account →
        </a>
      </div>
    </div>
  );
}
