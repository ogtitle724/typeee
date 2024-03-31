"use client";

import fetchIns from "@/lib/fetch";
import dynamic from "next/dynamic";
import Select from "@comps/select/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSave } from "react-icons/io5";
import { topics } from "@/config/topic";
import { delTags } from "@/lib/text";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import styles from "./write.module.css";

const Editor = dynamic(() => import("@comps/editor/editor"), { ssr: false });

//TODO: add loading page before load or route

export function WritePage() {
  const session = useSession();
  const router = useRouter();
  const query = useSearchParams();
  const isEdit = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [data, setData] = useState({
    title: "",
    content: "",
    topic: "",
    summary: "",
    thumbnail: "",
    author: {
      uid: "",
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (session.status === "authenticated") {
      setData((data) => ({
        ...data,
        author: {
          uid: session?.data?.user?.uid,
          name: session?.data?.user?.name,
          email: session?.data?.user?.email,
        },
      }));
    }
  }, [
    session?.data?.user?.email,
    session?.data?.user?.name,
    session?.data?.user?.uid,
    session.status,
  ]);

  useEffect(() => {
    const id = query.get("id");

    if (id) {
      const getData = async () => {
        try {
          const res = await fetchIns.get(
            process.env.NEXT_PUBLIC_URL_POST + `/${id}`
          );
          const resData = await res.json();

          if (resData === null) return router.push("/");
          const newData = structuredClone(resData);

          setData(newData);
          isEdit.current = true;
        } catch (err) {
          console.error(err.message);
          alert("There was an error when downloading post data");
        }
      };

      getData();
    }
  }, [query, router, session.data.user.uid]);

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

    const plainText = delTags(data.content);

    if (new Blob([plainText]).size > process.env.NEXT_PUBLIC_MAX_CONTENT_LEN) {
      return alert("The size of your post has exceeded the size limit :(");
    }

    setIsUploading(true);

    try {
      let res;
      data.summary = plainText.slice(0, process.env.NEXT_PUBLIC_SUMMARY_LEN);

      if (isEdit.current) {
        res = await fetchIns.patch(
          process.env.NEXT_PUBLIC_URL_POST + `/${query.get("id")}`,
          JSON.stringify(data)
        );
      } else {
        res = await fetchIns.post(
          process.env.NEXT_PUBLIC_URL_POST,
          JSON.stringify(data)
        );
      }

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
        placeholder="Enter the title here..."
        onChange={handleChangeTitle}
      />
      <div className={styles.editor_wrapper}>
        <Editor
          data={data.content}
          onChange={handleChangeContent}
          config={{
            placeholder: "Enter the content here...",
            removePlugins: ["MediaEmbedToolbar"],
          }}
        />
        <div className={styles.btn_wrapper}>
          <Select
            options={topics}
            value={data.topic}
            onChange={(e) => {
              const newData = { ...data, topic: e.target.value };
              setData(newData);
            }}
          />
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
