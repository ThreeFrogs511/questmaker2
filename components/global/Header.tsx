"use client";
import Menu from "@/components/global/Menu";
import { useState } from "react";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* menu */}
      <section
        id="menu"
        className={
          !isMenuOpen
            ? "z-998 fixed bg-black w-full -translate-x-full! h-full right-0 left-0 top-0 bottom-0  overflow-hidden "
            : "z-998 fixed  bg-black transition-all! ease-in-out duration-500! right-0 left-0 top-0 bottom-0 w-full h-full overflow-hidden"
        }
      >
        <Menu setIsMenuOpenAction={setIsMenuOpen} />
      </section>

      {/* header */}

      <header className="h-12! relative w-full!">
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="max-w-6! lg:max-w-6! cursor-pointer absolute right-2 top-2 z-999"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <path
            d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 5H4v2h16v-2z"
            fill={isMenuOpen ? "yellow" : "white"}
          />
        </svg>
      </header>
    </>
  );
}
