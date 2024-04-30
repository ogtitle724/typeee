"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { FaHashtag } from "react-icons/fa6";
import {
  IoCaretBackCircle,
  IoLockClosed,
  IoLockOpen,
  IoArrowBackOutline,
  IoSave,
} from "react-icons/io5";
import { topics } from "@/config/topic";
import { getFirstP } from "@/lib/text";
import Select from "@comps/select/select";
import Loader from "@comps/loader/loader";
import styles from "./write.module.css";
import { pathRevalidation, tagRevalidation } from "@/lib/revalidate";

const Editor = dynamic(() => import("@comps/editor/editor"), { ssr: false });

export function WritePage() {
  const session = useSession();
  const router = useRouter();
  const query = useSearchParams();
  const editId = query.get("id");
  const [isUploading, setIsUploading] = useState(false);
  const [hashTags, setHashTags] = useState("");
  const [isHashInputShow, seetIsHashInputShow] = useState(false);
  const [data, setData] = useState({
    title: "",
    content: "",
    topic: "",
    is_public: true,
    summary: "",
    thumbnail: "",
    tags: [],
    author: {
      uid: "",
      name: "",
      email: "",
      profile_img: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const confirmPopstate = (e) => {
        window.history.pushState(null, "", window.location.href);
      };

      if (data.title || data.content) {
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", confirmPopstate);
      }

      const confirmUnload = (e) => {
        e.preventDefault();
        return "";
      };

      window.addEventListener("beforeunload", confirmUnload);

      return () => {
        window.removeEventListener("popstate", confirmPopstate);
        window.removeEventListener("beforeunload", confirmUnload);
      };
    }
  }, [data.content, data.title]);

  useEffect(() => {
    if (session.status === "authenticated") {
      setData((data) => ({
        ...data,
        author: {
          uid: session?.data?.user?.uid,
          name: session?.data?.user?.name,
          email: session?.data?.user?.email,
          profile_img: session?.data?.user?.image,
        },
      }));
    }
  }, [
    session,
    session?.data?.user?.email,
    session?.data?.user?.name,
    session?.data?.user.profile_img,
    session?.data?.user?.uid,
    session.status,
  ]);

  useEffect(() => {
    if (editId) {
      const getData = async () => {
        try {
          const url = process.env.NEXT_PUBLIC_URL_POST + `/${editId}`;
          const options = {
            method: "GET",
            headers: { Accept: "application/json" },
            next: { revalidate: 0 },
          };

          const res = await fetch(url, options);
          const resData = await res.json();

          if (resData === null) return router.push("/");

          const newData = structuredClone(resData);
          setData(newData);
          setHashTags(newData.tags.join(" "));
        } catch (err) {
          console.error(err.message);
          alert("There was an error when downloading post data");
        }
      };

      getData();
    }
  }, [editId, query, router, session.data?.user?.uid]);

  const handleChangeTitle = (e) => {
    if (e.target.value.length <= process.env.NEXT_PUBLIC_MAX_TITLE_LEN) {
      setData((data) => ({
        ...data,
        title: e.target.value,
      }));
    }
  };

  const handleChangeContent = (event, editor) => {
    setData((data) => ({
      ...data,
      content: editor.getData(),
    }));
  };

  const handleClkBtnHash = () => {
    seetIsHashInputShow((cur) => !cur);
  };

  const handleChangeHashInput = (e) => {
    setHashTags(e.target.value);
  };

  const handleClkBtnLock = () => {
    setData((data) => ({
      ...data,
      is_public: !data.is_public,
    }));
  };

  const handleClkBtnBack = () => {
    const isConfirmed = confirm("Are you sure you want to go back?");

    if (isConfirmed) {
      const prevUrl = sessionStorage.getItem("prevUrl");
      router.push(prevUrl);
    }
  };

  const handleClkBtnUpload = async () => {
    if (session.status !== "authenticated") {
      return alert(
        "You must log in to write a post. (Please note that your data will be deleted during the login process.)"
      );
    }

    if (!data.title || !data.content || !data.topic) {
      return alert(
        "Please make sure you have entered all the title, content, and topic."
      );
    }

    if (hashTags) {
      data.tags = hashTags.trim().split(" ");
      const longTags = data.tags.filter((tag) => tag.length > 20);

      if (longTags.length)
        return alert("Set the hashtag to 20 characters or less.");
      if (data.tags.length > 6) return alert("Up to 20 hashtags are allowed.");
    }

    const plainText = getFirstP(data.content);

    if (new Blob([plainText]).size > process.env.NEXT_PUBLIC_MAX_CONTENT_LEN) {
      return alert("The size of your post has exceeded the size limit :(");
    }

    setIsUploading(true);

    try {
      let res;
      data.summary = plainText.slice(0, process.env.NEXT_PUBLIC_SUMMARY_LEN);

      if (editId) {
        res = await fetch(
          process.env.NEXT_PUBLIC_URL_POST + `/${query.get("id")}`,
          {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        await pathRevalidation(`/post/${query.get("id")}`);
      } else {
        res = await fetch(process.env.NEXT_PUBLIC_URL_POST, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      }

      await Promise.all([
        pathRevalidation(`/`),
        pathRevalidation(`/toic/${data.topic}`),
      ]);

      /* await tagRevalidation("paging"); */
      const resData = await res.json();
      router.push(`/post/${resData._id}`);
    } catch (err) {
      console.error(err.message);
      setIsUploading(false);
      alert(err.message);
    }
  };

  return (
    <>
      <input
        className={styles.write_title}
        value={data.title}
        placeholder={
          editId ? "Downloading title data now..." : "Enter the title here..."
        }
        onChange={handleChangeTitle}
      />
      <div className={styles.editor_wrapper}>
        <div className={styles.loader_pre}>
          <Loader />
        </div>
        <Editor
          data={data.content}
          onChange={handleChangeContent}
          config={{
            placeholder: editId
              ? "Downloading content now..."
              : "Enter the content here...",
            removePlugins: ["MediaEmbedToolbar"],
          }}
        />
        {!isHashInputShow && (
          <button
            className={styles.btn_hash + " type_a"}
            onClick={handleClkBtnHash}
          >
            <FaHashtag size={16} />
          </button>
        )}
        {isHashInputShow && (
          <div className={styles.hash_input_wrapper + " type_a"}>
            <input
              value={hashTags}
              placeholder="Separate keywords with spaces"
              onChange={handleChangeHashInput}
            />
            <button onClick={handleClkBtnHash} aria-label="close input">
              <IoCaretBackCircle size={28} />
            </button>
          </div>
        )}
        <div className={styles.btn_wrapper}>
          <Select
            options={topics}
            value={data.topic}
            placeholder={"--- TOPIC ---"}
            onChange={(e) => {
              const newData = { ...data, topic: e.target.value };
              setData(newData);
            }}
          />
          {data.is_public ? (
            <button onClick={handleClkBtnLock} className={styles.btn}>
              <IoLockOpen size={28} />
            </button>
          ) : (
            <button onClick={handleClkBtnLock} className={styles.btn}>
              <IoLockClosed size={28} />
            </button>
          )}
          {isUploading ? (
            <div className={styles.loader}></div>
          ) : (
            <button
              className={styles.btn}
              onClick={handleClkBtnUpload}
              disabled={isUploading}
            >
              <IoSave size={30} />
            </button>
          )}
        </div>
      </div>
      <button
        className={styles.btn_back}
        onClick={handleClkBtnBack}
        aria-label="button to navigate previouse page"
      >
        <IoArrowBackOutline size={30} color="grey" />
      </button>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <WritePage />
    </Suspense>
  );
}
