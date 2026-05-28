"use client";
import { useUserStore } from "@/stores/useUserStore";
import { useState, useRef, useEffect } from "react";
import { Input, Button } from "pixel-retroui";

import DeletionModal from "./DeletionModal";
import localFont from 'next/font/local'

const retroGaming = localFont({ src: '../../public/fonts/retro_gaming.ttf' })

export default function ProfileSettingsInputs() {
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);

  const currentUser = useUserStore((state) => state.currentUser);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [modal, openModal] = useState(false);

  const [error, setError] = useState("");
  const [valid, setValid] = useState("");
  const flag = useRef(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf="))
      ?.split("=")[1];

    if (token) return;
    fetch("/api/csrf", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          console.log("cookie créé");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  async function submitProfileChanges() {
    if (flag.current === true) return;
    setError("");
    setValid("");
    const chosenEmail = (document.getElementById("mail") as HTMLInputElement)
      .value;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf="))
      ?.split("=")[1];

    fetch(`/api/profileSettings/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "X-CSRF-Token": token ?? "",
      },
      body: JSON.stringify({
        email: chosenEmail,
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          updateProfile({ email: data.newEmail });
          setValid("Profile edited successfully");
        } else {
          setError(data.err);
        }
      });
  }

  return (
    <>
      <div className={`space-y-4 mb-4! flex flex-col items-center ${retroGaming.className}`}>
        <div className="w-full flex flex-col items-center">
          <label className="block text-sm mb-1">Email</label>
          <Input
            type="email"
            bg="#000000"
            id="mail"
            textColor="#ffffff"
            borderColor="#ffffff"
            defaultValue={currentUser.email ?? ""}
            className="w-[80%] lg:w-[50%] text-xs!"
          />
        </div>

        <div className="w-full flex flex-col items-center">
          <label className="block text-sm mb-1">Current password</label>
          <Input
            type="password"
            bg="#000000"
            textColor="#ffffff"
            borderColor="#ffffff"
            placeholder="Enter your current password"
            className="w-[80%] lg:w-[50%] text-xs!"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <label className="block text-sm mb-1">New password</label>
          <Input
            type="password"
            bg="#000000"
            textColor="#ffffff"
            borderColor="#ffffff"
            placeholder="Leave empty to not change it"
            className="w-[80%] lg:w-[50%] text-xs!"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row! justify-center items-center gap-1">
        <Button
          bg="#000000"
          textColor="#ffffff"
          borderColor="#ffffff"
          className="w-[80%] lg:w-[30%]"
          onPointerDown={submitProfileChanges}
        >
          Edit
        </Button>
        <Button
          bg="#000000"
          textColor="red"
          borderColor="red"
          className="w-[80%] lg:w-[30%]"
          onPointerDown={() => openModal(true)}
        >
          Delete account
        </Button>
      </div>
      <p
        className={
          error.trim()
            ? `h-10 text-red-600 text-xs text-center`
            : `h-10 text-green-400 text-xs text-center`
        }
      >
        {error.trim() === "" ? valid : error}
      </p>

      <DeletionModal
        modal={modal}
        openModalAction={openModal}
        setErrorAction={setError}
        setValidAction={setValid}
      />
    </>
  );
}
