"use client";

import fetchIns from "@/util/fetch";
import dynamic from "next/dynamic";
import Select from "@comps/select/select";
import styles from "./write.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSave } from "react-icons/io5";
import { topics } from "@/config/topic";

const Editor = dynamic(() => import("@comps/editor/editor"), { ssr: false });

export default function Page() {
  const query = useSearchParams();
  const router = useRouter();
  const isEdit = useRef(false);
  const [data, setData] = useState({
    title: "",
    content: "",
    topic: "",
    thumbnail: "",
    author: {
      id: "",
      nick: "",
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
          const preData = {
            title: resData.title,
            content: resData.content,
            topic: resData.topic,
            author: { ...resData.author },
            thumbnail: resData.thumbnail,
          };

          setData(preData);
          isEdit.current = true;
        } catch (err) {
          console.error(err.message);
          alert("There was an error when downloading post data");
        }
      };

      getData();
    }
  }, [query]);

  const handleClkBtnUpload = async () => {
    if (!data.title || !data.content || !data.topic) {
      return alert(
        "Please make sure you have entered all the title, content, and topic."
      );
    }

    //TODO: check whether image included. if image exist extract it and store it to S3 bucket and then use the url

    try {
      let res;

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
      console.log(resData);
      /* router.push(`/post/${resData._id}`); */
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  return (
    <>
      <input
        className={styles.write_title}
        value={data.title}
        placeholder="Enter the title here..."
        onChange={(e) => {
          const newData = { ...data, title: e.target.value };
          setData(newData);
        }}
      />
      <div className={styles.editor_wrapper}>
        <Editor
          data={data.content}
          onChange={(event, editor) => {
            const newData = { ...data, content: editor.getData() };
            setData(newData);
          }}
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
          <button className={styles.btn} onClick={handleClkBtnUpload}>
            <IoSave size={30} />
          </button>
        </div>
      </div>
    </>
  );
}
