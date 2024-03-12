"use client";

import fetchIns from "@/lib/fetch";
import dynamic from "next/dynamic";
import Select from "@comps/select/select";
import styles from "./write.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSave } from "react-icons/io5";
import { topics } from "@/config/topic";
import { delTags } from "@/lib/text";
import { Suspense } from "react";

const Editor = dynamic(() => import("@comps/editor/editor"), { ssr: false });

export function WritePage() {
  const query = useSearchParams();
  const router = useRouter();
  const session = { data: undefined, status: "unauthenticated" };
  const isEdit = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [data, setData] = useState({
    title: "",
    content: "",
    topic: "",
    summary: "",
    thumbnail: "",
    author: {
      uid: session?.data?.user?.uid || "",
      nick: session?.data?.user?.name || "",
      pwd: "",
    },
  });

  useEffect(() => {
    const id = query.get("id");

    if (id) {
      const getData = async () => {
        try {
          const res = await fetchIns.get(
            process.env.NEXT_PUBLIC_URL_POST + `/${id}`
          );
          const resData = await res.json();
          const newData = structuredClone(resData);
          newData.author.pwd = "";

          setData(newData);
          isEdit.current = true;
        } catch (err) {
          console.error(err.message);
          alert("There was an error when downloading post data");
        }
      };

      getData();
    }
  }, [query]);

  useEffect(() => {
    setData({
      ...data,
      author: {
        uid: session?.data?.user?.uid || "",
        nick: session?.data?.user?.name || "",
        pwd: "",
      },
    });
  }, [session?.data?.user?.name, session?.data?.user?.uid, session.status]);

  const handleChangeTitle = (e) => {
    if (e.target.value.length <= process.env.NEXT_PUBLIC_MAX_TITLE_LEN) {
      setData((prevData) => ({
        ...prevData,
        title: e.target.value,
      }));
    }
  };

  const handleChangeContent = (event, editor) => {
    setData((prevData) => ({
      ...prevData,
      content: editor.getData(),
    }));
  };

  const handleChangePwd = (e) => {
    if (e.target.value.length > 10) return;

    const newData = structuredClone(data);
    newData.author.pwd = String(e.target.value);
    setData(newData);
  };

  const handleClkBtnUpload = async () => {
    if (!data.title || !data.content || !data.topic) {
      return alert(
        "Please make sure you have entered all the title, content, and topic."
      );
    }

    if (session.status === "unauthenticated" && data.author.pwd.length < 4) {
      return alert("Please enter a password of at least 4 characters.");
    }

    const plainText = delTags(data.content);

    if (isOverMaximumTextSize(plainText)) {
      return alert("The size of your post has exceeded the size limit :(");
    }

    setIsUploading(true);

    //TODO: check whether image included. if image exist extract it and store it to S3 bucket and then use the url

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

  const isOverMaximumTextSize = (t) => {
    if (new Blob([t]).size > process.env.NEXT_PUBLIC_MAX_CONTENT_LEN) true;
    else false;
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
          {session.status === "unauthenticated" && (
            <input
              value={data.author.pwd}
              className={styles.input_pwd}
              onChange={handleChangePwd}
              placeholder="Password (4 ~ 10)"
            />
          )}
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
