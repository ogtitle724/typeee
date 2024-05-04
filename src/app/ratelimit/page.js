"use client";

import Link from "next/link";
import { IoArrowForwardCircle } from "react-icons/io5";
import styles from "./ratelimit.module.css";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isTimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsTimeOut(true);
    }, 1000 * 15);
  }, []);

  return (
    <div className={styles.pre + " type_a"}>
      <p className={styles.bg}>429</p>
      <div className={styles.content}>
        <p>Rate Limit Exceeded!</p>
        <p>{"please wait a moment before trying again."}</p>
        <div>
          {isTimeOut ? (
            <Link href={"/"}>
              <span>Home Page</span>
              <IoArrowForwardCircle size={30} />
            </Link>
          ) : (
            <span className={styles.loader}></span>
          )}
        </div>
      </div>
    </div>
  );
}
