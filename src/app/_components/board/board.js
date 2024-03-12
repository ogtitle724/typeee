"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./board.module.css";
import { IoCreateOutline } from "react-icons/io5";

export default function Board({ posts, type }) {
  return (
    <section
      className={
        styles.board + " " + (type === "list" ? styles.board_list : "")
      }
      aria-label="board"
    >
      {posts.length ? (
        <ul className={styles.ul}>
          {posts.map((post, idx) => {
            return <Item key={"post_" + idx} post={post} />;
          })}
        </ul>
      ) : (
        <div className={styles.empty}>
          <Link href={"/write"}>
            <IoCreateOutline size={30} color={"white"} strokeWidth={20} />
          </Link>
          <p>Write the first Article!</p>
        </div>
      )}
    </section>
  );
}

function Item({ post }) {
  return (
    <li className={styles.li}>
      <Link href={`/post/${post._id}`}>
        <div className={styles.title_wrapper}>
          <span className={styles.title}>
            <span className={styles.topic}>{post.topic}</span>
            {" • " + post.title}
          </span>
        </div>
        {post.thumbnail && (
          <div className={styles.img_wrapper}>
            {/* <Image
              alt={`image of article "${post.title}"`}
              src={"/"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill={true}
            /> */}
          </div>
        )}

        <div className={styles.content_wrapper}>
          <p
            className={
              styles.content +
              " " +
              (post.thumbnail ? styles.content_short : styles.content_long)
            }
          >
            {post.summary || "test"}
          </p>
        </div>
      </Link>
    </li>
  );
}
