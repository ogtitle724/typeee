"use client";

import { IoSettings } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { topics } from "@/config/topic";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Board from "../_components/board/mgt/board";
import styles from "./mypage.module.css";
import { disableScroll } from "@/lib/scroll";
import { isMobileBrowser } from "@/lib/browser";

export default function MyPage() {
  const session = useSession();
  const [curTopic, setCurTopic] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pagingData, setPagingData] = useState();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") router.push("/");
  }, [router, session]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setIsLoading(true);
        const select = "_id topic title wr_date is_public";
        const query = {
          "author.uid": session.data.user.uid,
        };

        if (curTopic) query.topic = curTopic.toLowerCase();

        const url =
          process.env.NEXT_PUBLIC_URL_PAGING +
          `?page=${curPage}&query=${JSON.stringify(query)}&select=${select}`;
        const options = {
          method: "GET",
          headers: { Accept: "application/json" },
        };

        const res = await fetch(url, options);
        const pagingData = await res.json();
        setPagingData(pagingData);
      } catch (err) {
        console.error("ERROR(/mypage > page.js)", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (session.data) fetchMyPosts();
  }, [curPage, session, session.id, curTopic]);

  if (session.data) {
    return (
      <section className={styles.pre}>
        <div className={styles.profile}>
          <Image
            alt="my page profile image"
            src={session.data.user.image}
            width={26}
            height={26}
          />
          <span>{session.data.user.name}</span>
          <button className={styles.btn_edit_profile}>
            <IoSettings size={20} />
          </button>
        </div>
        <div className={styles.my_posts}>
          <TopicNav
            curTopic={curTopic}
            setCurTopic={setCurTopic}
            setCurPage={setCurPage}
            topics={topics}
          />

          <Board
            curPage={curPage}
            setCurPage={setCurPage}
            pagingData={pagingData}
            setPagingData={setPagingData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </section>
    );
  } else {
    return;
  }
}

function TopicNav({ curTopic, setCurTopic, setCurPage, topics }) {
  const topicsRef = useRef();
  const left = useRef(0);
  const [width, setWidth] = useState();

  useEffect(() => {
    if (typeof window) {
      window.addEventListener("resize", (e) => setWidth(e.target.innerWidth));
    }
  }, []);

  useEffect(() => {
    const topics = topicsRef.current;
    const isHorizontalScroll = typeof window && !isMobileBrowser() && topics;

    if (isHorizontalScroll) {
      topics.style.overflow = "hidden";
      disableScroll(topics, false);

      const containerWidth = topics.offsetWidth;
      const itemWidth = topics.children[0].offsetWidth;
      const diff = containerWidth - itemWidth;
      const step = 45;
      const horizontalScroll = (e) => {
        if (e.deltaY > 0 && left.current - step > -Math.abs(diff) - 40)
          left.current -= step;
        if (e.deltaY < 0 && left.current + step < 10) {
          left.current += step;
        }

        topics.children[0].style.left = `${left.current}px`;
      };

      if (diff < 0) {
        topics.addEventListener("wheel", horizontalScroll);
      }

      return () => topics.removeEventListener("wheel", horizontalScroll);
    }
  }, [width]);

  const handleClkBtnTopic = (e) => {
    setCurPage(1);
    setCurTopic(e.target.dataset.topic);
  };

  return (
    <section ref={topicsRef} className={styles.nav_container}>
      <nav className={styles.nav}>
        <button
          className={
            styles.btn_topic + (curTopic ? "" : " " + styles.btn_topic_focus)
          }
          data-topic=""
          onClick={handleClkBtnTopic}
        >
          ALL
        </button>
        {topics.map((ele) => (
          <button
            className={
              styles.btn_topic +
              " " +
              (curTopic === ele ? styles.btn_topic_focus : "")
            }
            key={"mypage_nav_" + ele}
            onClick={handleClkBtnTopic}
            data-topic={ele}
          >
            {ele}
          </button>
        ))}
      </nav>
    </section>
  );
}
