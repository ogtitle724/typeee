"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./board.module.css";
import { IoCreateOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import fetchIns from "@/lib/fetch";

export default function Board({ pagingData, type, isPagination, query }) {
  const [nextPosts, setNextPosts] = useState([]);
  const lastItemRef = useRef();
  console.log("BOARD DATA", pagingData);
  useEffect(() => {
    if (!isPagination && pagingData.totalPage > 1) {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              const res = await fetchIns.get(
                process.env.NEXT_PUBLIC_URL_PAGING +
                  `?query=${query}&page=${nextPosts.length / 30 + 2}`
              );

              const pagingData = await res.json();
              setNextPosts((nextPosts) => [...nextPosts, ...pagingData.posts]);
              observer.disconnect(entry.target);
            }
          });
        },
        { rootMargin: "300px 0px" }
      );

      if (lastItemRef.current) {
        io.observe(lastItemRef.current);
      }
    }
  }, [isPagination, nextPosts.length, pagingData.totalPage, query]);

  return (
    <section
      className={
        styles.board + " " + (type === "list" ? styles.board_list : "")
      }
      aria-label="board"
    >
      {pagingData.posts.length ? (
        <ul className={styles.ul}>
          {pagingData.posts.map((post, idx) => {
            const isLast =
              pagingData.posts.length - 1 === idx && nextPosts.length === 0;
            if (isLast) {
              return (
                <Item itemRef={lastItemRef} key={"post_" + idx} post={post} />
              );
            } else {
              return <Item key={"post_" + idx} post={post} />;
            }
          })}
          {!isPagination &&
            nextPosts.map((post, idx) => {
              const isLast = nextPosts.length - 1 === idx;

              if (isLast) {
                return (
                  <Item
                    itemRef={lastItemRef}
                    key={"nextPost_" + idx}
                    post={post}
                  />
                );
              } else {
                return <Item key={"nextPost_" + idx} post={post} />;
              }
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

      {isPagination && totalPage > 1 && (
        <PageNav totalPage={pagingData.totalPage} unit={11} />
      )}
    </section>
  );
}

function Item({ itemRef, post }) {
  const path = usePathname();
  const isSearch = path.includes("/search");

  return (
    <li ref={itemRef} className={styles.li}>
      <Link href={`/post/${post.id}`}>
        <div className={styles.title_wrapper}>
          <span className={styles.title}>
            <span className={styles.topic}>{post.topic}</span>
            {" • " + post.title}
          </span>
        </div>
        {!isSearch && post.thumbnail && (
          <div className={styles.img_wrapper}>
            <Image
              alt={`thumbnail of article "${post.title}"`}
              src={post.thumbnail}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill={true}
            />
          </div>
        )}

        {!isSearch && (
          <div className={styles.content_wrapper}>
            <p className={styles.content}>{post.summary || "test"}</p>
          </div>
        )}
      </Link>
    </li>
  );
}

function PageNav({ totalPage, unit }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const [page, setPage] = useState();
  const [pages, setPages] = useState([]);
  const query = useRef("");

  useEffect(() => {
    const curPage = +params.get("page") || 1;
    setPage(curPage);

    const start = Math.min(
      Math.max(curPage - (unit - 1) / 2, 1),
      Math.max(totalPage - unit, 1)
    );

    let tempPages = [];

    for (let i = start; i < start + 11; i++) {
      if (i > totalPage) break;
      tempPages.push(i);
    }

    setPages([...tempPages]);
    query.current = "";

    for (const [key, value] of params) {
      query.current += `${key}=${value}&`;
    }

    query.current = query.current.slice(0, -1);
  }, [params, totalPage, unit]);

  useEffect(() => {
    const start = Math.min(
      Math.max(page - (unit - 1) / 2, 1),
      Math.max(totalPage - unit, 1)
    );

    let tempPages = [];

    for (let i = start; i < start + 11; i++) {
      if (i > totalPage) break;
      tempPages.push(i);
    }

    setPages([...tempPages]);
  }, [page, totalPage, unit]);

  const handleClkBtnRotateNav = (dir) => {
    if (dir) {
      setPage((page) => Math.min(page + unit, totalPage));
    } else {
      setPage((page) => Math.max(page - unit, 1));
    }
  };

  return (
    <section className={styles.pageNav + " card"}>
      <button
        className={styles.pageNav_dir}
        onClick={() => handleClkBtnRotateNav(0)}
      >
        <IoChevronBackOutline size={17} />
      </button>
      {pages.map((next) => {
        if (next === +params.get("page")) {
          return (
            <span
              className={styles.pageNav_num + " " + styles.pageNav_num_cur}
              key={"page nav (current page)"}
            >
              {next}
            </span>
          );
        } else {
          const regex = /(page=)\d+/;
          let newQuery = query.current.slice();
          newQuery = newQuery.replace(regex, `page=${next}`);

          if (!params.get("page")) newQuery += `page=${next}`;

          return (
            <Link
              href={pathname + `?${newQuery}`}
              key={"page nav button " + next}
            >
              <span className={styles.pageNav_num}>{next}</span>
            </Link>
          );
        }
      })}
      <button
        className={styles.pageNav_dir}
        onClick={() => handleClkBtnRotateNav(1)}
      >
        <IoChevronForwardOutline size={17} />
      </button>
    </section>
  );
}
