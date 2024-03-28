"use client";

import { copyToClipboard } from "@/lib/text";
import { useState } from "react";
import { IoCopy } from "react-icons/io5";
import { IoCheckmarkCircle } from "react-icons/io5";
import styles from "./copy.module.css";

export default function BtnCopy({ text, color }) {
  const [isCopy, setIsCopy] = useState(false);
  const handleClkBtnCopy = (text) => {
    copyToClipboard(text);
    setIsCopy(true);
    setTimeout(() => setIsCopy(false), 1000);
  };

  return (
    <>
      {isCopy ? (
        <div className={styles.btn}>
          <IoCheckmarkCircle size={18} color="black" />
        </div>
      ) : (
        <button
          className={styles.btn}
          aria-label="copy code"
          onClick={() => handleClkBtnCopy(text)}
        >
          {color ? <IoCopy size={18} color={color} /> : <IoCopy size={18} />}
        </button>
      )}
    </>
  );
}
