"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IoCreateOutline } from "react-icons/io5";
import styles from "./btn_edit.module.css";

export default function BtnEdit(props) {
  const router = useRouter();
  const { status } = useSession();

  const handleClkBtnEdit = async () => {
    if (status === "unauthenticated") {
      const inputId = String(prompt("Please enter a password."));
      console.log(inputId, props.comparePwd);

      if (!inputId) return;
      if (inputId !== props.comparePwd) {
        return alert("Please check your password");
      }
    }
    console.log(props.targetId);
    router.push(`/write?id=${props.targetId}`);
  };

  return (
    <button
      className={styles.btn}
      onClick={handleClkBtnEdit}
      aria-label="edit button"
    >
      <IoCreateOutline size={props.size} color="grey" />
    </button>
  );
}
