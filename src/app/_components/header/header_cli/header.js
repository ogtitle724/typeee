"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoSearchOutline, IoCheckmark, IoCreateOutline } from "react-icons/io5";
import { topics } from "@/config/topic";
import { useSession } from "next-auth/react";

import ToggleBtn from "@comps/btn/toggle_btn/toggle_btn";
import styles from "./header.module.css";
import { GoogleSignIn, SignOut } from "@comps/btn/auth/auth_btns";

export default function Header() {
  const [isSearch, setIsSearch] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const params = useParams();
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

      return () => window.removeEventListener("scroll", headerScrollEffect);
    }
  }, []);

  useEffect(() => {
    setIsSearch(false);
    setIsMenu(false);
    setSearchParam("");
  }, [path]);

  const handleClkBtnSearch = useCallback(() => {
    if (isSearch) {
      if (searchParam) {
        router.push(`/search?param=${searchParam}&page=1`);
        setIsSearch(false);
        setIsMenu(false);
        setSearchParam("");
      }
    } else {
      setIsSearch(true);
    }
  }, [isSearch, router, searchParam]);

  const handleClkBtnMenu = useCallback(
    (e) => {
      e.stopPropagation();

      if (!isMenu && !isSearch) {
        setIsMenu(true);
      } else {
        if (isMenu) setIsMenu(false);
        if (isSearch) {
          setIsSearch(false);
          setSearchParam("");
        }
      }
    },
    [isMenu, isSearch]
  );

  return (
    <>
      <section ref={headerRef} className={styles.pre + " type_a"}>
        {isSearch ? (
          <input
            className={styles.input_search}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            placeholder="Search..."
          />
        ) : (
          <div className={styles.title_wrapper}>
            <Link href="/" onClick={() => setIsMenu(false)}>
              <h3>{process.env.NEXT_PUBLIC_SITE_NAME}</h3>
            </Link>
            {params.topic && (
              <span className={styles.topic}>{` › ${params.topic}`}</span>
            )}
          </div>
        )}
        <div className={styles.btn_wrapper}>
          <button onClick={handleClkBtnSearch} aria-label="search button">
            {isSearch ? (
              <IoCheckmark size={24} />
            ) : (
              <IoSearchOutline size={22} />
            )}
          </button>
          <ToggleBtn isClk={isSearch || isMenu} onClick={handleClkBtnMenu} />
        </div>
        {isMenu && <Menu setIsMenu={setIsMenu} />}
      </section>
    </>
  );
}

function Menu(props) {
  console.log("HEADER MENU");
  const targetParam = useParams().topic;
  const session = useSession();
  const router = useRouter();
  const menuRef = useRef();

  useEffect(() => {
    const touchClose = (e) => {
      const mX = e.clientX;
      const mY = e.clientY;
      const { left, right, top, bottom } =
        menuRef.current.getBoundingClientRect();

      if (!(mY > top && mY < bottom && mX > left && mX < right)) {
        props.setIsMenu(false);
      }
    };

    if (typeof window !== undefined && menuRef.current) {
      window.addEventListener("click", touchClose);
    }

    return () => window.removeEventListener("click", touchClose);
  }, [props]);

  const handleClkBtnCreate = () => {
    if (session.status === "unauthenticated") {
      const navForLogin = confirm("Would you like to login to write post?");

      if (navForLogin) {
        router.push("/api/auth/signin");
      }
    } else {
      props.setIsMenu(false);
      router.push("/write");
    }
  };

  return (
    <div ref={menuRef} className={styles.menu + " type_a"}>
      <Link
        href={`/`}
        className={
          styles.menu_item + (targetParam ? "" : " " + styles.menu_item_focus)
        }
        onClick={() => props.setIsMenu(false)}
      >
        {"Home"}
      </Link>
      {topics.map((topic) => {
        return (
          <Link
            key={`menuItem_${topic.toLowerCase()}`}
            href={`/topic/${topic.toLowerCase()}?page=1`}
            className={
              styles.menu_item +
              (topic.toLowerCase() === targetParam
                ? " " + styles.menu_item_focus
                : "")
            }
            onClick={() => props.setIsMenu(false)}
          >
            {topic}
          </Link>
        );
      })}
      <div className={styles.menu_btn_wrapper}>
        {session.status !== "authenticated" ? (
          <GoogleSignIn />
        ) : (
          <div className={styles.menu_sign_wrapper}>
            <Link href={"/mypage"} className={styles.menu_a_mypage}>
              MyPage
            </Link>
            <SignOut closeMenu={() => props.setIsMenu(false)} />
          </div>
        )}
        <button
          className={styles.btn_write}
          onClick={handleClkBtnCreate}
          aria-label="write button"
        >
          <IoCreateOutline size={22} />
        </button>
      </div>
    </div>
  );
}
