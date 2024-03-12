"use client";

import { useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import styles from "./auth_btns.module.css";

function GoogleAuthButton() {
  const url = useRef();
  const handleClkBtnGoogleAuth = () => {};

  useEffect(() => {
    if (typeof window !== undefined) {
      url.current = window.location.href;
    }
  }, []);

  return (
    <button
      className={styles.sign_btn}
      onClick={handleClkBtnGoogleAuth}
      aria-label="sign in/up with google"
    >
      <FcGoogle size={18} />
      <span>- login</span>
    </button>
  );
}

function SignOutButton() {
  const handleClkBtnSignOut = () => {};
  return (
    <button
      className={styles.sign_btn}
      onClick={handleClkBtnSignOut}
      aria-label="sign out button"
    >
      <span>sign out</span>
    </button>
  );
}

export { GoogleAuthButton, SignOutButton };
