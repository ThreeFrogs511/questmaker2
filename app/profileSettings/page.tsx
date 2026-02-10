"use client";
import { Card, Input, Button } from "pixel-retroui";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";

export default function ProfileSettings() {
  const templateMail = "nicolas@lavarde.fr";
  const router = useRouter();
  const currentUser = useUserStore((state) => state.currentUser);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
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

  //loading the email
  useEffect(() => {
    if (!currentUser || !currentUser.id || flag.current === true) return;
    flag.current = true;
    console.log(currentUser.id);

    fetch(`/api/profileSettings/${currentUser.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEmail(data.email);
          console.log(data.email);
        } else {
          console.log(data.err);
        }
      })
      .catch((data) => console.log(data.err))
      .finally(() => (flag.current = false));
  }, [currentUser, currentUser.id]);

  async function submitProfileChanges() {
    if (flag.current === true) return;
    setError("");
    setValid("");

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
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEmail(data.newEmail);
          setValid("Profile edited successfully");
        } else {
          setError(data.err);
        }
      });
  }

  return (
    <>
      <div className="wrapper">
        <Header />
        <Card
          bg="#000000"
          textColor="#ffffff"
          borderColor="#ffffff"
          className="lg:w-[70%]! w-[90%]! my-5! mx-auto! p-6 flex flex-col justify-around"
        >
          <div>
            <h1 className="text-4xl! font-bold mt-5! mb-2! text-center font-minecraft">
              Profile
            </h1>
            <p className="text-sm mb-6 text-center">
              Manage your account information.
            </p>
          </div>

          <div className="space-y-4 mb-4 flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
              <label className="block text-sm mb-2">Email</label>
              <Input
                type="email"
                bg="#000000"
                textColor="#ffffff"
                borderColor="#ffffff"
                defaultValue={email}
                className="w-[50%]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col items-center">
              <label className="block text-sm mb-2">Current password</label>
              <Input
                type="password"
                bg="#000000"
                textColor="#ffffff"
                borderColor="#ffffff"
                className="w-[50%]"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <label className="block text-sm mb-2">New password</label>
              <Input
                type="password"
                bg="#000000"
                textColor="#ffffff"
                borderColor="#ffffff"
                className="w-[50%]"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <input type="hidden" data-token="test" />
            <p className="text-base mb-6">
              Changes will be confirmed on the next step.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button
              bg="#000000"
              textColor="#ffffff"
              borderColor="#ffffff"
              className="w-[50%]"
              onPointerDown={submitProfileChanges}
            >
              Edit
            </Button>
            <Button
              bg="#000000"
              textColor="red"
              borderColor="red"
              className="w-[50%]"
              onPointerDown={() => router.push("/profileSettings/delete")}
            >
              Delete account
            </Button>
            <p
              className={
                error.trim()
                  ? `h-3 text-red-600 my-2`
                  : `h-3 text-green-400 my-2`
              }
            >
              {error.trim() === "" ? valid : error}
            </p>
          </div>
        </Card>
        <Footer />
      </div>
    </>
  );
}
