"use client";

import { signInHandler } from "@/lib/sign_handler";
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

export function SignOut(props) {
  const router = useRouter();
  const handleClkSignOut = () => {
    signOut({ redirect: false });

    setTimeout(() => {
      props.closeMenu();
      router.refresh();
    }, 300);
  };

  return (
    <button
      type="submit"
      className={styles.sign_btn}
      aria-label="sign out button"
      onClick={handleClkSignOut}
    >
      <span>SignOut</span>
    </button>
  );
}
