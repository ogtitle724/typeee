"use client";
import Link from "next/link";
import styles from "./board.module.css";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";

export function PageNav({ totalPage, unit }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const [page, setPage] = useState(params.get("page") || 1);
  const [pages, setPages] = useState([]);
  let query = "";

  console.log("page=======", page);

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

    for (const [key, value] of params) {
      query += `${key}=${value}&`;
    }
  }, [page, totalPage, unit]);

  query = "?" + query.slice(0, -1);

  const handleClkBtnRotateNav = (dir) => {
    if (dir) {
      setPage((page) => Math.min(page + unit, totalPage));
    } else {
      setPage((page) => Math.max(page - unit, 1));
    }
  };

  return (
    <section className={styles.pageNav}>
      <button onClick={handleClkBtnRotateNav}>
        <IoChevronBackOutline />
      </button>
      {pages.map((next) => {
        console.log(next, page, next === page);
        if (next == +page) {
          return <h3 key={"page nav (current page)"}>{next}</h3>;
        } else {
          const regex = /(page=)\d+/;
          let newQuery = query.replace(regex, `page=${next}`);

          if (query === newQuery) newQuery += `page=${next}`;

          return (
            <Link href={pathname + newQuery} key={"page nav button " + next}>
              {next}
            </Link>
          );
        }
      })}
      <button onClick={handleClkBtnRotateNav}>
        <IoChevronForwardOutline />
      </button>
    </section>
  );
}
