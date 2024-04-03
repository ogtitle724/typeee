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
  const [posts, setPosts] = useState(pagingData.posts);
  const lastRef = useRef();
  const io = useRef();

  useEffect(() => {
    if (lastRef.current && !isPagination && pagingData.totalPage > 1) {
      io.current = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              const res = await fetchIns.get(
                process.env.NEXT_PUBLIC_URL_PAGING +
                  `?query=${query}&page=${posts.length / 30 + 2}`
              );

              const pagingData = await res.json();
              setPosts((posts) => [...posts, ...pagingData.posts]);
              observer.disconnect(entry.target);
            }
          });
        },
        { rootMargin: "300px 0px" }
      );

      if (lastRef.current && !isPagination && pagingData.totalPage > 1) {
        io.observe(lastRef.current);
      }
    }
  }, [isPagination, pagingData.totalPage, posts.length, query]);

  useEffect(() => {
    if (lastRef.current && !isPagination && pagingData.totalPage > 1) {
      io.observe(lastRef.current);
    }
  }, [isPagination, pagingData.totalPage, posts]);

  return (
    <section className={styles.pre} aria-label="board">
      {posts.length ? (
        <ul
          className={styles.ul + " " + (type === "list" ? styles.ul_list : "")}
        >
          {pagingData.posts.map((post, idx) => {
            const isLast = posts.length - 1 === idx;

            if (isLast && !isPagination) {
              return <Item lastRef={lastRef} key={"post_" + idx} post={post} />;
            } else {
              return <Item key={"post_" + idx} post={post} />;
            }
          })}
        </ul>
      ) : (
        <div className={styles.empty}>
          <Link href={"/write"}>
            <IoCreateOutline size={30} color={"white"} strokeWidth={20} />
          </Link>
          <p>Write the first Posts!</p>
        </div>
      )}

      {isPagination && pagingData.totalPage > 1 && (
        <PageNav totalPage={pagingData.totalPage} unit={11} />
      )}
    </section>
  );
}

function Item({ lastRef, post }) {
  const path = usePathname();
  const isSearch = path.includes("/search");
  const [isHover, setIsHover] = useState(false);
  const [isTagRotate, setIsTagRotate] = useState(false);
  const itemRef = useRef();
  const tagContainerRef = useRef();

  useEffect(() => {
    const containerWidth = tagContainerRef.current.offsetWidth;
    const tagsWidth = tagContainerRef.current.children[0].offsetWidth;

    if (containerWidth * 0.8 < tagsWidth) {
      setIsTagRotate(true);
    }
    console.log(containerWidth * 0.8 < tagsWidth);
    const item = itemRef.current;
    const over = () => setIsHover(true);
    const out = () => setIsHover(false);

    if (item) {
      item.addEventListener("touchstart", over);
      item.addEventListener("touchend", out);
      item.addEventListener("mouseover", over);
      item.addEventListener("mouseout", out);
    }

    return () => {
      item.removeEventListener("touchstart", over);
      item.removeEventListener("touchend", out);
      item.removeEventListener("mouseover", over);
      item.removeEventListener("mouseout", out);
    };
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
            <p className={styles.item_content}>{post.summary || "test"}</p>
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
