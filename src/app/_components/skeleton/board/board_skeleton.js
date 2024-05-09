"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./board_skeleton.module.css";
import debounce from "@/lib/debounce";

export default function BoardSkeleton() {
  const posts = new Array(12).fill(null);
  const [isGrid, setIsGrid] = useState(null);
  const [width, setWidth] = useState(null);

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

  if (!width) return null;

  return (
    <section className={styles.pre}>
      {isGrid ? (
        <>
          <ul className={styles.grid_col}>
            {posts
              .filter((post, idx) => idx % 3 === 0)
              .map((post, idx) => (
                <ItemSkeleton key={"post_" + idx} isGrid={isGrid} post={post} />
              ))}
          </ul>
          <ul className={styles.grid_col}>
            {posts
              .filter((post, idx) => idx % 3 === 1)
              .map((post, idx) => (
                <ItemSkeleton key={"post_" + idx} isGrid={isGrid} post={post} />
              ))}
          </ul>
          <ul className={styles.grid_col}>
            {posts
              .filter((post, idx) => idx % 3 === 2)
              .map((post, idx) => (
                <ItemSkeleton key={"post_" + idx} isGrid={isGrid} post={post} />
              ))}
          </ul>
        </>
      ) : (
        <ul className={styles.list}>
          {posts.map((post, idx) => (
            <ItemSkeleton key={"post_" + idx} isGrid={isGrid} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ItemSkeleton({ isGrid }) {
  const path = usePathname();
  const isSearch = path.includes("/search");

  return (
    <li className={styles.item_skeleton}>
      <div>
        <div className={styles.item_skeleton_metadata}>
          <span className={styles.item_skeleton_topic + " skeleton_bg"}></span>
        </div>
        <h2 className={styles.item_skeleton_title}>
          <div className="skeleton_bg"></div>
          {isGrid && (
            <>
              <div className="skeleton_bg"></div>
              <div className="skeleton_bg"></div>
            </>
          )}
        </h2>
        {!isSearch && (
          <>
            <div className={styles.item_skeleton_content}>
              <div className="skeleton_bg"></div>
              <div className="skeleton_bg"></div>
              <div className="skeleton_bg"></div>
            </div>
            <div className={styles.item_skeleton_profile}>
              <span className="skeleton_bg"></span>
              <div
                className={styles.item_skeleton_profile_img + " skeleton_bg"}
              ></div>
            </div>
          </>
        )}
      </div>
    </li>
  );
}
