"use client";
import { IoSettings } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { topics } from "@/config/topic";
import { useEffect, useState } from "react";
import Image from "next/image";
import Board from "../_components/board/mgt/board";
import fetchIns from "@/lib/fetch";
import styles from "./mypage.module.css";

export default function MyPage({ params }) {
  console.log("MYPAGE");
  const session = useSession();
  const [curTopic, setCurTopic] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [pagingData, setPagingData] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") router.push("/");
  }, [router, session]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const select = "_id topic title wr_date is_public";
        const query = {
          "author.uid": session.data.user.uid,
        };

        if (curTopic) query.topic = curTopic.toLowerCase();

        const res = await fetchIns.get(
          process.env.NEXT_PUBLIC_URL_PAGING +
            `?page=${curPage}&query=${JSON.stringify(query)}&select=${select}`
        );
        const pagingData = await res.json();

        setPagingData(pagingData);
      } catch (err) {
        console.error(err.message);
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
            width={30}
            height={30}
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
            topics={topics}
          />
          <Board
            title={"My Posts"}
            curPage={curPage}
            setCurPage={setCurPage}
            pagingData={pagingData}
          />
        </div>
      </section>
    );
  } else {
    return;
  }
}

function TopicNav({ curTopic, setCurTopic, topics }) {
  const handleClkBtnTopic = (e) => setCurTopic(e.target.dataset.topic);

  return (
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
            (curTopic === ele ? " " + styles.btn_topic_focus : "")
          }
          key={"mypage_nav_" + ele}
          onClick={handleClkBtnTopic}
          data-topic={ele}
        >
          {ele}
        </button>
      ))}
    </nav>
  );
}
