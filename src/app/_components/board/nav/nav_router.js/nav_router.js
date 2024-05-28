import {
  IoCaretBackOutline,
  IoCaretForwardOutline,
  IoChevronUpCircle,
  IoChevronDownCircle,
} from "react-icons/io5";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./nav_router.module.css";

export function NavRouter({ totalPage, unit }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const [page, setPage] = useState(+params.get("page") || 1); //value for mark centered page
  const [pages, setPages] = useState([]);
  const query = useRef("");

  useEffect(() => {
    query.current = "";

    for (const [key, value] of params) {
      query.current += `${key}=${value}&`;
    }

    query.current = query.current.slice(0, -1);
  }, [params]);

  useEffect(() => {
    const start = Math.min(
      Math.max(page - (unit - 1) / 2, 1),
      Math.max(totalPage - unit + 1, 1)
    );

    let tempPages = [];

    for (let i = start; i < start + unit; i++) {
      if (i > totalPage) break;
      tempPages.push(i);
    }

    setPages([...tempPages]);
  }, [page, totalPage, unit]);

  useEffect(() => setPage(+params.get("page") || 1), [params]);

  const handleClkBtnRotateNav = (dir) => {
    const half = (unit - 1) / 2;

    if (dir) {
      if (page < half) setPage((page) => page + half + unit);
      else setPage((page) => Math.min(page + unit, totalPage));
    } else {
      if (page > totalPage - half) setPage((page) => page - half - unit);
      else setPage((page) => Math.max(page - unit, 1));
    }
  };

  const handleClkBtnBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleClkBtnTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Suspense>
      <nav className={styles.pre + " type_a"}>
        <ul>
          <li>
            <button
              className={styles.dir}
              onClick={() => handleClkBtnRotateNav(0)}
            >
              <IoCaretBackOutline size={20} />
            </button>
          </li>
          {pages.map((next) => {
            if (
              next === +params.get("page") ||
              (!params.get("page") && next === 1)
            ) {
              return (
                <li key={"page nav (current page)"}>
                  <span className={styles.page + " " + styles.page_cur}>
                    {next}
                  </span>
                </li>
              );
            } else {
              const regex = /(page=)\d+/;
              let newQuery = query.current.slice();
              newQuery = newQuery.replace(regex, `page=${next}`);

              if (!params.get("page")) newQuery += `page=${next}`;

              return (
                <li key={"page nav button " + next}>
                  <Link href={pathname + (next === 1 ? "" : `?${newQuery}`)}>
                    <span className={styles.page}>{next}</span>
                  </Link>
                </li>
              );
            }
          })}
          <li>
            <button
              className={styles.dir}
              onClick={() => handleClkBtnRotateNav(1)}
            >
              <IoCaretForwardOutline size={20} />
            </button>
          </li>
          <div className={styles.btn_wrapper}>
            <button onClick={handleClkBtnTop}>
              <IoChevronUpCircle size={30} />
            </button>
            <button onClick={handleClkBtnBottom}>
              <IoChevronDownCircle size={30} />
            </button>
          </div>
        </ul>
      </nav>
    </Suspense>
  );
}
