"use client";
import { IoRefreshCircle } from "react-icons/io5";
import styles from "./error_fetch.module.css";

export default function ErrorFetch() {
  return (
    <section>
      <button aria-label="refresh button">
        <IoRefreshCircle />
      </button>
      <span></span>
    </section>
  );
}
