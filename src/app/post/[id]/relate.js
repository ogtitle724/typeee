"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./relate.module.css";

export default function RelatedPosts({ wr_date, uid, topic, title }) {
  const [relatePosts, setRelatePosts] = useState();

  useEffect(() => {
    const getRelatePosts = async () => {
      try {
        const url =
          process.env.NEXT_PUBLIC_URL_RELATE +
          `?wr_date=${new Date(
            wr_date
          ).toISOString()}&uid=${uid}&topic=${topic}`;
        const options = {
          method: "GET",
          headers: { Accept: "application/json" },
        };
        const res = await fetch(url, options);
        const body = await res.json();
        setRelatePosts(body);
      } catch (err) {
        console.error(
          "ERROR(/app/post/[id]/relate.js > <RelatePosts>):",
          err.message
        );
      }
    };

    getRelatePosts();
  }, [topic, uid, wr_date]);

  if (!relatePosts) return;

  return (
    <section className={styles.relatePosts}>
      <ul>
        {relatePosts.nextPosts.map((nextPost, idx) => {
          return (
            <li className={styles.next} key={`next post ${idx}`}>
              <Link href={`/post/${nextPost._id}`}>{nextPost.title}</Link>
            </li>
          );
        })}
        {<li className={styles.related_cur}>{title}</li>}
        {relatePosts.prevPosts.map((prevPost, idx) => {
          return (
            <li key={`prev post ${idx}`}>
              <Link href={`/post/${prevPost._id}`}>{prevPost.title}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
