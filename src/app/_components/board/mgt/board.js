"use client";
import Link from "next/link";
import styles from "./board.module.css";
import { NavState } from "../nav/nav_state/nav_state";
import { useState, useRef, useEffect } from "react";
import { IoLockClosed } from "react-icons/io5";
import Loader from "@/app/_components/loader/loader";
import { tagRevalidation } from "@/lib/revalidate";

export default function Board({
  title,
  pagingData,
  setPagingData,
  curPage,
  setCurPage,
}) {
  const [delTargets, setDelTargets] = useState(new Set());
  const isMouseDown = useRef(false);

  useEffect(() => {
    const mouseDown = () => (isMouseDown.current = true);
    const mouseUp = () => (isMouseDown.current = false);

    if (typeof window) {
      window.addEventListener("mousedown", mouseDown);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  const handleClkCheckbox = (e) => {
    const targetId = e.target.dataset.id;
    const newSet = structuredClone(delTargets);

    if (delTargets.has(targetId)) newSet.delete(targetId);
    else newSet.add(targetId);
    setDelTargets(newSet);
  };

  const handleOutCheckbox = (e) => {
    if (!isMouseDown.current) return;

    const targetId = e.target.dataset.id;
    const newSet = structuredClone(delTargets);

    if (delTargets.has(targetId)) newSet.delete(targetId);
    else newSet.add(targetId);
    setDelTargets(newSet);
  };

  const handleClkBtnSelectAll = () => {
    const newSet = structuredClone(delTargets);

    if (delTargets.size === pagingData.posts.length) {
      setDelTargets(new Set());
    } else {
      for (let post of pagingData.posts) {
        newSet.add(post.id);
      }

      setDelTargets(newSet);
    }
  };

  const handleClkBtnDel = async () => {
    if (!delTargets.size) return;

    const isDel = confirm("Are you sure to delete all the posts you select?");

    if (isDel) {
      try {
        for (const target of delTargets) {
          const url = process.env.NEXT_PUBLIC_URL_POST + `/${target}`;
          await fetch(url, { method: "DELETE" });
        }

        setPagingData({
          ...pagingData,
          posts: pagingData.posts.filter((post) => !delTargets.has(post.id)),
        });
        setDelTargets(new Set());
        tagRevalidation("paging");
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  return (
    <section className={styles.pre}>
      {title && (
        <header className={styles.header}>
          <h2>{title}</h2>
        </header>
      )}
      <ul className={styles.ul}>
        {pagingData ? (
          pagingData.posts.length ? (
            pagingData.posts.map((post, idx) => {
              return (
                <li key={"post_" + idx}>
                  <Link href={`/post/${post.id}`}>
                    <span className={styles.item_idx}>
                      {idx + 1 + (curPage - 1) * 30}
                    </span>
                    <span className={styles.item_title}>{post.title}</span>
                    {!post.is_public && <IoLockClosed size={15} />}
                    <span className={styles.item_date}>
                      {post.wr_date.slice(0, -14)}
                    </span>
                  </Link>
                  <div
                    className={
                      styles.checkbox +
                      " " +
                      (delTargets.has(post.id) ? styles.checkbox_active : "")
                    }
                    onClick={handleClkCheckbox}
                    onMouseOut={handleOutCheckbox}
                    data-id={post.id}
                    role="radio-button"
                  ></div>
                </li>
              );
            })
          ) : (
            <span className={styles.empty}>no data</span>
          )
        ) : (
          <div className={styles.loader_pre}>
            <Loader />
          </div>
        )}
      </ul>
      <div className={styles.btn_wrapper}>
        <NavState
          curPage={curPage}
          setCurPage={setCurPage}
          totalPage={pagingData?.totalPage}
          unit={9}
        />
        <button className={styles.btn} onClick={handleClkBtnSelectAll}>
          select all
        </button>
        <button className={styles.btn} onClick={handleClkBtnDel}>
          delete
        </button>
      </div>
    </section>
  );
}
