"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoSearchOutline, IoCheckmark } from "react-icons/io5";
import { categories } from "@/config/data";
import ToggleBtn from "@comps/btn/toggle_btn/toggle_btn";
import styles from "./header.module.css";

export default function Header() {
  const [isSearch, setIsSearch] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [searchParam, setSearchParam] = useState("");
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

  const handleClkBtnSearch = useCallback(() => {
    if (isSearch) {
      if (searchParam) {
        router.push(`/search?param=${searchParam}&page=1`);
        setIsSearch(false);
        setIsCategory(false);
        setSearchParam("");
      }
    } else {
      setIsSearch(true);
    }
  }, [isSearch, router, searchParam]);

  const handleClkBtnMenu = useCallback(() => {
    if (!isCategory && !isSearch) {
      setIsCategory(true);
    } else {
      if (isCategory) setIsCategory(false);
      if (isSearch) {
        setIsSearch(false);
        setSearchParam("");
      }
    }
  }, [isCategory, isSearch]);

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
        <Link href="/">
          <h3>TYPYtab</h3>
        </Link>
      )}
      <div className={styles.btn_wrapper}>
        <button onClick={handleClkBtnSearch}>
          {isSearch ? <IoCheckmark size={24} /> : <IoSearchOutline size={22} />}
        </button>
        <ToggleBtn isClk={isSearch || isCategory} onClick={handleClkBtnMenu} />
      </div>
      {isCategory && <Menu setIsCategory={setIsCategory} />}
    </header>
  );
}

function Menu({ setIsCategory }) {
  const topic = useParams().topic;

  return (
    <div className={styles.menu + " card"}>
      {categories.map((category) => {
        return (
          <Link
            key={`menuItem_${category.toLowerCase()}`}
            href={`/topic/${category.toLowerCase()}`}
            className={
              styles.menuItem +
              (category.toLowerCase() === topic
                ? " " + styles.menuItem_focus
                : "")
            }
            onClick={() => setIsCategory(false)}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
