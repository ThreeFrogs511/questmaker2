"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";



export default function Menu({setIsMenuOpenAction} : {setIsMenuOpenAction: React.Dispatch<React.SetStateAction<boolean>>}) {
  const router = useRouter();
  const style = "font-minecraft text-3xl! sm:text-3xl! md:ml-10!";
  const pathname = usePathname();


  async function logout() {
    setIsMenuOpenAction(false);
    const response = await fetch("api/logout", {
      method: "DELETE",
    });
    const feedback = await response.json();
    if (feedback.success) {
      router.push("/titleScreen");
    };
  }

  function navigationHandler(destination: string) {
    if (pathname === destination) {
      setIsMenuOpenAction(false);
    } else {
      router.push(destination);
    }
  };

  return (
    <>
      <div
        className=" relative h-full w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 2xl:px-60 
        max-w-400 mx-auto flex items-end"
      >
        <nav
          className="h-[95%] max-h-full! flex flex-col gap-15 md-gap-5! justify-center! md:justify-center! items-center w-full px-4
            sm:px-1 md:px-5 lg:px-20 xl:px-40 2xl:px-60 max-w-400 mx-auto"
        >
          {/* journal */}
          <div
            onPointerDown={() => navigationHandler("/journal")}
            className=" cursor-pointer w-full flex hover:text-amber-300!"
          >
            <p className={style}>Journal</p>
          </div>

          {/* Campaigns */}
          <div
            onPointerDown={() => navigationHandler("/campaignList")}
            className="cursor-pointer w-full flex hover:text-amber-300!"
          >
            <p className={style}>Campaigns</p>
          </div>

          {/* Character Sheet */}
          <div
            onPointerDown={() => navigationHandler("/characterSheet")}
            className="cursor-pointer w-full flex hover:text-amber-300!"
          >
            <p className={style}>Character Sheet</p>
          </div>

          {/* store */}
          <div
            onPointerDown={() => navigationHandler("/store")}
            className="cursor-pointer w-full flex hover:text-amber-300!"
          >
            <p className={style}>Store</p>
          </div>

          {/* Settings */}
          <div
            onPointerDown={() => navigationHandler("/profileSettings")}
            className="cursor-pointer w-full flex hover:text-amber-300!"
          >
            <p className={style}>Profile Settings</p>
          </div>

          {/* logout */}
          <div
            className="w-full flex cursor-pointer hover:text-amber-300"
            onPointerDown={logout}
          >
            <p className={style}>Logout</p>
          </div>
        </nav>
      </div>
    </>
  );
}
