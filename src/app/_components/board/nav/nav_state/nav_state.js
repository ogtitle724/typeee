import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import styles from "./nav_state.module.css";

export function NavState({ curPage, setCurPage, totalPage, unit }) {
  const [page, setPage] = useState(curPage);
  const [pages, setPages] = useState([]);
  console.log(page);
  const setNextPages = useCallback(
    (nextPage) => {
      const start = Math.min(
        Math.max(nextPage - (unit - 1) / 2, 1),
        Math.max(totalPage - unit + 1, 1)
      );

      let tempPages = [];

      for (let i = start; i < start + unit; i++) {
        if (i > totalPage) break;
        tempPages.push(i);
      }

      setPages([...tempPages]);
    },
    [totalPage, unit]
  );

  useEffect(() => {
    setNextPages(curPage);
  }, [curPage, setNextPages]);

  useEffect(() => {
    setNextPages(page);
  }, [page, setNextPages]);

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

  const handleClkBtnPage = (e) => {
    setCurPage(+e.target.innerText);
  };

  return (
    <nav className={styles.pre}>
      <ul>
        <li>
          <button
            className={styles.dir}
            onClick={() => handleClkBtnRotateNav(0)}
          >
            <IoChevronBackOutline size={17} />
          </button>
        </li>
        {pages.map((next) => {
          if (next === curPage) {
            return (
              <li key={"page nav (current page)"}>
                <span className={styles.page + " " + styles.page_cur}>
                  {next}
                </span>
              </li>
            );
          } else {
            return (
              <li key={"page nav button " + next}>
                <button className={styles.page} onClick={handleClkBtnPage}>
                  {next}
                </button>
              </li>
            );
          }
        })}
        <li>
          <button
            className={styles.dir}
            onClick={() => handleClkBtnRotateNav(1)}
          >
            <IoChevronForwardOutline size={17} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
