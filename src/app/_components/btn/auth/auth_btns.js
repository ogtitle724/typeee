"use client";

import { signInHandler } from "./handler";
import { FcGoogle } from "react-icons/fc";
import { signOut } from "next-auth/react";
import styles from "./auth_btns.module.css";
import { useRouter } from "next/navigation";

export function GoogleSignIn() {
  return (
    <form action={signInHandler}>
      <button
        type="submit"
        className={styles.sign_btn}
        aria-label="sign in/up with google"
      >
        <FcGoogle size={18} />
        <span>- login</span>
      </button>
    </form>
  );
}

export function SignOut() {
  const router = useRouter();
  const handleClkSignOut = () => {
    signOut({ redirect: false });
    setTimeout(() => router.refresh(), 500);
  };

  return (
    <button
      type="submit"
      className={styles.sign_btn}
      aria-label="sign out button"
      onClick={handleClkSignOut}
    >
      <span>sign out</span>
    </button>
  );
}
