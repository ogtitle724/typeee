"use server";
import { signOut, signIn } from "@/auth";

export const signInHandler = async () => {
  "use server";
  await signIn("google");
};

export const signOutHandler = async () => {
  "use server";
  await signOut();
};
