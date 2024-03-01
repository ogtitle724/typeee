"use client";

import { useRouter } from "next/navigation";
import styles from "./btn_del.module.css";
import { IoTrashOutline } from "react-icons/io5";
import fetchIns from "@/lib/fetch";
import { useSession } from "next-auth/react";

export default function BtnDelete(props) {
  const router = useRouter();
  const { status } = useSession();

  const handleClkBtnDel = async () => {
    if (status === "unauthenticated") {
      const inputId = String(prompt("Please enter a password."));

      if (!inputId) return;
      if (inputId !== props.comparePwd) {
        return alert("Please check your password");
      }
    }

    const isDeleteOk = confirm("Would you like to delete your post? :(");

    if (isDeleteOk) {
      try {
        await fetchIns.delete(props.url);
        router.back();
      } catch (err) {
        console.error("BtnDelete Error :", err.message);
      }
    } else {
      return;
    }
  };

  return (
    <button
      className={styles.btn}
      onClick={handleClkBtnDel}
      aria-label="delete button"
    >
      <IoTrashOutline size={props.size} color="grey" />
    </button>
  );
}
