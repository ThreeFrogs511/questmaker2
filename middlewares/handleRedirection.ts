import { redirect } from "next/navigation";

export async function handleRedirection(pathname: string) {
  redirect(pathname);
}