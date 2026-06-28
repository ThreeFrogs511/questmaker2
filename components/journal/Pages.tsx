"use client";
import { useJournalStore } from "@/stores/useJournalStore";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";


export default function Pages() {
  const setAreQuestsLoaded = useJournalStore(
    (state) => state.setAreQuestsLoaded,
  );
  const page = useJournalStore((state) => state.page);
  const setPage = useJournalStore((state) => state.setPage);
  const numberOfPages = useJournalStore((state) => state.numberOfPages);


  function calculatingNumberOfPagesSamples() {
    switch (numberOfPages) {
      case 1:
        return [];

      case 2:
        return ["1", "2"];

      case 3:
        return ["1", "2", "3"];

      default:
        let currentPage = page - 1;
        currentPage = currentPage === 0 ? 1 : currentPage;
        const arr = [currentPage.toString()];
        for (let i = 1; i < 3; i++) {
          const newPageNumber = currentPage + i;
          if (newPageNumber > numberOfPages) break;
          arr.push(newPageNumber.toString());
        }
        return arr;
    }
  };

  const [pagesNumber] = useState(calculatingNumberOfPagesSamples);


  return (
    <div className="w-full flex justify-center ">
      <div className="w-full xl:w-[25%]! xl:min-w-[25%]! grid grid-rows-1 grid-cols-3 gap-2">
        <button
          className={`${page <= 1 ? "" : "flex justify-center cursor-pointer hover:text-amber-300"}`}
          onClick={() => {
            setAreQuestsLoaded(false);
            setPage(page - 1);
          }}
        >
          {page <= 1 ? " " : <ChevronsLeft />}
        </button>

        <ul className="flex justify-center">
          {pagesNumber.map((nb, index) => (
            <li
              onClick={() => {
                setAreQuestsLoaded(false);
                setPage(Number(nb));
              }}
              className={`${page === Number(nb) ? "text-center w-full cursor-pointer text-amber-300" : "text-center w-full cursor-pointer hover:text-amber-300"}`}
              key={index}
            >
              {nb}
            </li>
          ))}
        </ul>

        <button
          className={`${page >= numberOfPages ? "" : " flex justify-center cursor-pointer hover:text-amber-300"}`}
          onClick={() => {
            setAreQuestsLoaded(false);
            setPage(page + 1);
          }}
        >
          {page >= numberOfPages ? "" : <ChevronsRight />}
        </button>
      </div>
    </div>
  );
}
