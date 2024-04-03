"use client";

import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import fetchIns from "@/lib/fetch";

export default function BtnDelete(props) {
  const router = useRouter();

  const handleClkBtnDel = async () => {
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
    <button onClick={handleClkBtnDel} aria-label="delete button">
      <IoTrashOutline size={props.size} color="grey" />
    </button>
  );
}
