import TypeWriterTitle from "@/components/login/TypewriterTitle";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div
      id="loginWrapper"
      className="h-full! w-full flex flex-col justify-evenly gap-0 md:gap-2 items-center"
    >
      <div className="h-[20%] flex flex-col justify-center my-5">
        <TypeWriterTitle />
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
