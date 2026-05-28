"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function Menu({setIsMenuOpenAction} : {setIsMenuOpenAction: React.Dispatch<React.SetStateAction<boolean>>}) {
  const router = useRouter();
  const style = "text-xl! sm:text-2xl! md:ml-10!";
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
        className={` relative h-full w-full px-4 sm:px-6 md:px-10 lg:px-20 max-w-400 mx-auto flex items-center ${retroGaming.className}`}
      >
        <nav
          className="h-[70%] shrink flex flex-col justify-evenly! items-center w-full px-4
            sm:px-1 md:px-5 lg:px-20 max-w-400 mx-auto "
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
            onPointerDown={() => navigationHandler("/launcher")}
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

          {/* Inventory */}
          <div
            onPointerDown={() => navigationHandler("/inventory")}
            className="cursor-pointer w-full flex hover:text-amber-300!"
          >
            <p className={style}>Inventory</p>
          </div>

          {/* store */}
          <div
            onPointerDown={() => navigationHandler("/merchant")}  
            className="cursor-pointer w-full flex hover:text-amber-300!"
          >
            <p className={style}>Merchant</p>
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
