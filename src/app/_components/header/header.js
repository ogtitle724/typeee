"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoSearchOutline, IoCheckmark, IoCreateOutline } from "react-icons/io5";
import { topics } from "@/config/topic";
import ToggleBtn from "@comps/btn/toggle_btn/toggle_btn";
import styles from "./header.module.css";

export default function Header() {
  const [isSearch, setIsSearch] = useState(false);
  const [isTopic, setIsTopic] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const path = usePathname();
  const router = useRouter();
  const headerRef = useRef();
  const scrollY = useRef();

  useEffect(() => {
    const header = headerRef.current;

    if (header) {
      scrollY.current = window.scrollY;

      const headerScrollEffect = (e) => {
        if (window.scrollY - scrollY.current > 0) {
          header.style.top = `-${header.offsetHeight}px`;
          header.style.opacity = 0;
        } else if (window.scrollY - scrollY.current < 0) {
          header.style.top = "20px";
          header.style.opacity = 1;
        }

        scrollY.current = window.scrollY;
      };

      window.addEventListener("scroll", headerScrollEffect);

      return () =>
        window.removeEventListener("scroll", (e) => {
          console.log(e);
        });
    }
  }, []);

  useEffect(() => {
    setIsSearch(false);
    setIsTopic(false);
    setSearchParam("");
  }, [path]);

  const handleClkBtnSearch = useCallback(() => {
    if (isSearch) {
      if (searchParam) {
        router.push(`/search?param=${searchParam}&page=1`);
        setIsSearch(false);
        setIsTopic(false);
        setSearchParam("");
      }
    } else {
      setIsSearch(true);
    }
  }, [isSearch, router, searchParam]);

  const handleClkBtnMenu = useCallback(() => {
    if (!isTopic && !isSearch) {
      setIsTopic(true);
    } else {
      if (isTopic) setIsTopic(false);
      if (isSearch) {
        setIsSearch(false);
        setSearchParam("");
      }
    }
  }, [isTopic, isSearch]);

  return (
    <header ref={headerRef} className={styles.header + " card"}>
      {isSearch ? (
        <input
          className={styles.input_search}
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          placeholder="Search..."
        />
      ) : (
        <Link href="/" onClick={() => setIsTopic(false)}>
          <h3>TYPYtab</h3>
        </Link>
      )}
      <div className={styles.btn_wrapper}>
        <button onClick={handleClkBtnSearch} aria-label="search button">
          {isSearch ? <IoCheckmark size={24} /> : <IoSearchOutline size={22} />}
        </button>
        <ToggleBtn isClk={isSearch || isTopic} onClick={handleClkBtnMenu} />
      </div>
      {isTopic && <Menu setIsTopic={setIsTopic} />}
    </header>
  );
}

function Menu({ setIsTopic }) {
  const targetParam = useParams().topic;

  return (
    <div className={styles.menu + " card"}>
      <Link
        href={`/`}
        className={
          styles.menu_item + (targetParam ? "" : " " + styles.menu_item_focus)
        }
        onClick={() => setIsTopic(false)}
      >
        {"Home"}
      </Link>
      {topics.map((topic) => {
        return (
          <Link
            key={`menuItem_${topic.toLowerCase()}`}
            href={`/topic/${topic.toLowerCase()}`}
            className={
              styles.menu_item +
              (topic.toLowerCase() === targetParam
                ? " " + styles.menu_item_focus
                : "")
            }
            onClick={() => setIsTopic(false)}
          >
            {topic}
          </Link>
        );
      })}
      <div className={styles.menu_btnWrapper}>
        <div className={styles.menu_sign}>
          <button>LogIn</button>
          <button>SignUp</button>
        </div>
        <Link
          href={"/write"}
          className={styles.menu_btn}
          onClick={() => setIsTopic(false)}
        >
          <IoCreateOutline size={25} />
        </Link>
      </div>
    </div>
  );
}
