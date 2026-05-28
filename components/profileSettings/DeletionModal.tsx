"use client";
import { Button } from "pixel-retroui";
import { useState, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

interface DeletionModalType {
  modal:boolean;
  openModalAction:Dispatch<SetStateAction<boolean>>;
  setErrorAction:Dispatch<SetStateAction<string>>;
  setValidAction: Dispatch<SetStateAction<string>>;
};

export default function DeletionModal({modal, openModalAction, setErrorAction, setValidAction} : DeletionModalType) {

  const flag = useRef(false);
  const [deleting, setDeleting] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);
  const router = useRouter();

  async function deleteAccount() {
    if (flag.current === true) return;
    setErrorAction("");
    setValidAction("");

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf="))
      ?.split("=")[1];

    fetch(`/api/profileSettings/${currentUser.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "X-CSRF-Token": token ?? "",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          router.push("/titleScreen");
        } else {
          setErrorAction(data.err);
        }
      });
  }

  return (
    <div
      id="modalDeletion"
      className={
        !modal
          ? "hidden"
          : deleting
            ? "fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 modalDeletion pointer-events-none"
            : "fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 modalDeletion"
      }
    >
      <div className={`flex flex-col bg-black gap-3 justify-center mt-5 border border-white p-15 rounded-lg ${retroGaming.className}`}>
        <div>
          Are you sure you want to delete your account ? This action is
          irreversible.
        </div>

        <Button
          bg="#000000"
          textColor="red"
          borderColor="red"
          onPointerDown={() => {
            setDeleting(true);
            deleteAccount();
          }}
        >
          Yes, delete my account
        </Button>
        <Button
          bg="#000000"
          textColor="#ffffff"
          borderColor="#ffffff"
          onPointerDown={() => {
            openModalAction(false);
          }}
        >
          No, keep my account
        </Button>
      </div>
    </div>
  );
}
