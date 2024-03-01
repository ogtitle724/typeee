"use client";
import { memo } from "react";
import styles from "./btn.module.css";

function ToggleBtn({ isClk, onClick }) {
  return (
    <>
      <button
        className={styles.btn + (isClk ? " " + styles.btn_clk : "")}
        onClick={onClick}
        aria-label="toggle"
      >
        <div>
          <div className={styles.btnBar}></div>
          <div className={styles.btnBar}></div>
          <div className={styles.btnBar}></div>
        </div>
      </button>
    </>
  );
}

export default memo(ToggleBtn);
