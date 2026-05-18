"use client";
import { Card, Input, Button } from "pixel-retroui";
import Header from "@/components/global/Header";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import Loading from "../loading";
import { useUserContext } from "@/context/context";

export default function ProfileSettings() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.currentUser);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [modal, openModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [valid, setValid] = useState("");
  const flag = useRef(false);
  // const email = currentUser.email ?? "No email found"
  const [deleting, setDeleting] = useState(false);

  const { isAuthenticated, isProfileCompleted } = useUserContext();
  useEffect(()=> {
    console.log("user email:", currentUser.email)
  }, [currentUser.email])

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

  if (!isAuthenticated || !isProfileCompleted) {
    return <Loading />;
  }

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
          updateProfile({email:data.newEmail})
          setValid("Profile edited successfully");
        } else {
          setError(data.err);
        }
      });
  }

  async function deleteAccount() {
    if (flag.current === true) return;
    setError("");
    setValid("");

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
          setError(data.err);
        }
      });
  }

  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="w-full max-h-full flex flex-col justify-center items-center">
          <Card
            bg="#000000"
            textColor="#ffffff"
            borderColor="#ffffff"
            className="lg:w-[70%]! w-[90%]! h-[90%] bg-black flex flex-col justify-around gap-5 p-3"
          >
            <h1 className=" text-xl! font-bold mt-2! mb-3 lg:mb-5! text-center font-minecraft">
              Profile
            </h1>

            <div className="space-y-4 mb-4! flex flex-col items-center">
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
          </Card>
        </div>
      </div>

      {/* modal */}

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
        <div className="flex flex-col bg-black gap-3 justify-center mt-5 border border-white p-15 rounded-lg ">
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
              openModal(false);
            }}
          >
            No, keep my account
          </Button>
        </div>
      </div>
    </>
  );
}
