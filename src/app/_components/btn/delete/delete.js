"use client";

import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";

export default function BtnDelete(props) {
  const router = useRouter();

  const handleClkBtnDel = async () => {
    const isDeleteOk = confirm("Would you like to delete your post? :(");

    if (isDeleteOk) {
      try {
        await fetch(props.url, { method: "DELETE" });
        router.back();
      } catch (err) {
        console.error("BtnDelete Error :", err.message);
      }
    } else {
      return;
    }
  };

  return (
    <button onClick={handleClkBtnDel} aria-label="delete button">
      <IoTrashOutline size={props.size} color="grey" />
    </button>
  );
}
