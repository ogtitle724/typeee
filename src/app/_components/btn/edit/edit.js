"use client";

import { useRouter } from "next/navigation";
import { IoCreateOutline } from "react-icons/io5";
import styles from "./btn_edit.module.css";

export default function BtnEdit(props) {
  const router = useRouter();

  const handleClkBtnEdit = async () =>
    router.push(`/write?id=${props.targetId}`);

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
