import TypeWriterTitle from "@/components/signup/TypewriterTitle";
import SignupForm from "@/components/signup/SignupForm";


export default function Signup() {
 

  return (
    <div
      id="signupWrapper"
      className="h-full! w-full flex flex-col justify-evenly gap-0 md:gap-2 items-center"
    >
      <div className="h-[20%] flex flex-col justify-center my-5">
        <TypeWriterTitle />
      </div>

      <SignupForm />


      <div className="mb-5 ">
        <a href="/login" className="font-minecraft text-sm underline!">
          Log in →
        </a>
      </div>
    </div>
  );
}
