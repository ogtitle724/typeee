"use client";

import { useRouter } from "next/navigation";
import { IoCreateOutline } from "react-icons/io5";

export default function BtnEdit(props) {
  const router = useRouter();

  const handleClkBtnEdit = async () =>
    router.push(`/write?id=${props.targetId}`);

  return (
    <button onClick={handleClkBtnEdit} aria-label="edit button">
      <IoCreateOutline size={props.size} color="grey" />
    </button>
  );
}
