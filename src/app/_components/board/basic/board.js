"use client";

import Link from "next/link";
import Image from "next/image";
import Loader from "@comps/loader/loader";
import debounce from "@/lib/debounce";
import { IoCreateOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavRouter } from "../nav/nav_router.js/nav_router";
import styles from "./board.module.css";

export default function Board({ pagingData, isPagination, query }) {
  const [posts, setPosts] = useState(pagingData.posts);
  const [isGrid, setIsGrid] = useState(null);
  const [width, setWidth] = useState(null);
  const sectionRef = useRef();

  useEffect(() => {
    const handleResize = debounce(() => setWidth(window.innerWidth), 100);
    if (typeof window) {
      setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window) {
      if ((width && width < 770) || window.innerWidth < 770) {
        setIsGrid(false);
      } else {
        setIsGrid(true);
      }
    }
  }, [width]);

  if (posts.length) {
    if (width === null) {
      return null;
    } else {
      return (
        <section ref={sectionRef} className={styles.pre}>
          {isGrid ? (
            <>
              <ul className={styles.grid_col}>
                {posts
                  .filter((post, idx) => idx % 3 === 0)
                  .map((post, idx) => (
                    <Item key={"post_" + idx} post={post} />
                  ))}
              </ul>
              <ul className={styles.grid_col}>
                {posts
                  .filter((post, idx) => idx % 3 === 1)
                  .map((post, idx) => (
                    <Item key={"post_" + idx} post={post} />
                  ))}
              </ul>
              <ul className={styles.grid_col}>
                {posts
                  .filter((post, idx) => idx % 3 === 2)
                  .map((post, idx) => (
                    <Item key={"post_" + idx} post={post} />
                  ))}
              </ul>
            </>
          ) : (
            <ul className={styles.list}>
              {posts.map((post, idx) => (
                <Item key={"post_" + idx} post={post} />
              ))}
            </ul>
          )}
          {isPagination && pagingData.totalPage > 1 && (
            <NavRouter totalPage={pagingData.totalPage} unit={11} />
          )}
        </section>
      );
    }
  } else {
    return (
      <div className={styles.empty}>
        <Link href={"/write"}>
          <IoCreateOutline size={30} color={"white"} strokeWidth={20} />
        </Link>
        <p>Write the first Posts!</p>
      </div>
    );
  }
}

function Item({ lastRef, post }) {
  const path = usePathname();
  const isSearch = path.includes("/search");
  const [isHover, setIsHover] = useState(false);
  const [isTagRotate, setIsTagRotate] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const itemRef = useRef();
  const tagContainerRef = useRef();

  useEffect(() => {
    const containerWidth = tagContainerRef.current.offsetWidth;
    const tagsWidth = tagContainerRef.current.children[0].offsetWidth;

    if (containerWidth * 0.8 < tagsWidth) {
      setIsTagRotate(true);
    }

    const item = itemRef.current;

    if (item) {
      const over = () => setIsHover(true);
      const out = () => setIsHover(false);
      const click = () => setIsClick(true);

      item.addEventListener("touchstart", over);
      item.addEventListener("touchend", out);
      item.addEventListener("mouseover", over);
      item.addEventListener("mouseout", out);
      item.addEventListener("click", click);

      return () => {
        item.removeEventListener("touchstart", over);
        item.removeEventListener("touchend", out);
        item.removeEventListener("mouseover", over);
        item.removeEventListener("mouseout", out);
      };
    }
  }, [isTagRotate]);

  return (
    <li
      ref={itemRef}
      className={styles.item + (isHover ? " " + styles.item_hover : "")}
    >
      <Link ref={lastRef} href={`/post/${post.id}`}>
        <div className={styles.item_metadata}>
          <span className={styles.item_topic}>{post.topic}</span>
          <div ref={tagContainerRef} className={styles.item_tags_container}>
            <div
              className={
                styles.item_tags +
                (isTagRotate ? " " + styles.item_tags_rotate : "")
              }
            >
              {post.tags.map((tag) => (
                <span key={"#" + tag}>{"#" + tag}</span>
              ))}
              {isTagRotate &&
                post.tags.map((tag) => (
                  <span key={"#" + tag}>{"#" + tag}</span>
                ))}
            </div>
          </div>
        </div>
        <h2 className={styles.item_title}>{post.title}</h2>
        {!isSearch && (
          <>
            {post.thumbnail && (
              <div className={styles.item_img_wrapper}>
                <Image
                  className={styles.item_img}
                  alt={`thumbnail of "${post.title}"`}
                  src={post.thumbnail}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill={true}
                />
              </div>
            )}
            {!post.thumbnail && (
              <p className={styles.item_content}>{post.summary || "test"}</p>
            )}
            <div className={styles.item_profile}>
              <span>{post.author.name}</span>
              <Image
                alt="author profile image"
                src={post.author.profile_img}
                width={22}
                height={22}
              />
            </div>
          </>
        )}
      </Link>
      {isClick && (
        <div className={styles.item_loader_pre + " skeleton_bg"}></div>
      )}
    </li>
  );
}
