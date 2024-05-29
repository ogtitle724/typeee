"use client";
import Link from "next/link";
import Loader from "@/app/_components/loader/loader";
import { NavState } from "../nav/nav_state/nav_state";
import { useState, useRef, useEffect } from "react";
import { IoLockClosed } from "react-icons/io5";
import { pathRevalidation } from "@/lib/revalidate";
import styles from "./board.module.css";

export default function Board({
  title,
  pagingData,
  setPagingData,
  curPage,
  setCurPage,
  isLoading,
  setIsLoading,
}) {
  const [delTargets, setDelTargets] = useState({});
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

  const handleClkCheckbox = (e, topic) => {
    const targetId = e.target.dataset.id;
    const newSet = structuredClone(delTargets);

    if (delTargets[targetId]) delete newSet[targetId];
    else newSet[targetId] = topic;
    setDelTargets(newSet);
  };

  const handleOutCheckbox = (e, topic) => {
    if (!isMouseDown.current) return;

    const targetId = e.target.dataset.id;
    const newSet = structuredClone(delTargets);

    if (delTargets[targetId]) delete newSet[targetId];
    else newSet[targetId] = topic;
    setDelTargets(newSet);
  };

  const handleClkBtnSelectAll = () => {
    const newSet = structuredClone(delTargets);

    if (Object.keys(delTargets).length === pagingData.posts.length) {
      setDelTargets(new Set());
    } else {
      for (let post of pagingData.posts) {
        newSet[post.id] = post.topic;
      }

      setDelTargets(newSet);
    }
  };

  const handleClkBtnDel = async () => {
    if (!Object.keys(delTargets).length) return;

    const isDel = confirm("Are you sure to delete all the posts you select?");

    if (isDel) {
      setIsLoading(true);
      const topics = new Set();

      try {
        for (const [target, topic] of Object.entries(delTargets)) {
          const url = process.env.NEXT_PUBLIC_URL_POST + `/${target}`;
          await fetch(url, { method: "DELETE" });
          topics.add(topic);
        }

        setPagingData({
          ...pagingData,
          posts: pagingData.posts.filter((post) => !delTargets[post.id]),
        });
        setDelTargets({});
      } catch (err) {
        console.error(err.message);
      } finally {
        for (const topic of topics.values()) {
          await pathRevalidation(`/topic/${topic}`);
          await pathRevalidation("/");
        }
        setIsLoading(true);
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
        {pagingData && !isLoading ? (
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
                      (delTargets[post.id] ? styles.checkbox_active : "")
                    }
                    onClick={(e) => handleClkCheckbox(e, post.topic)}
                    onMouseOut={(e) => handleOutCheckbox(e, post.topic)}
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
          setIsLoading={setIsLoading}
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
