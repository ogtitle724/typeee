import BtnDelete from "@comps/btn/delete/delete";
import BtnEdit from "@comps/btn/edit/edit";
import Image from "next/image";
import CodeBlock from "@comps/code/code";
import { sanitize } from "@/lib/secure";
import { auth } from "@/auth";
import { getMetadata } from "@/config/metadata";
import styles from "./postDetail.module.css";
import { paging, read } from "@/service/mongoDB/mongoose_post";
import { cache } from "react";
import dynamic from "next/dynamic";
import Img from "@comps/img/img";

const RelatedPosts = dynamic(() => import("./relate.js"), {});

const cachedRead = cache(async (id) => {
  const postData = await read(id);
  return postData;
});

export const generateMetadata = async ({ params }) => {
  try {
    const id = params.id;
    const postData = await cachedRead(id);

    if (postData) {
      return getMetadata(
        postData.title,
        postData.summary || postData.title,
        process.env.URL + `/post/${params.id}`,
        postData.thumbnail,
        postData.tags
      );
    } else {
      return getMetadata();
    }
  } catch (err) {
    console.error(
      "ERROR(app/post/[id]/page.js > generateMetadata):",
      err.message,
      params.id
    );
  }
};

export const generateStaticParams = async () => {
  try {
    const pagingData = await paging(1, {}, "_id", Infinity);
    return pagingData.posts;
  } catch (err) {
    console.error(
      "ERROR(/app/post/[id]/page.js) > generateStaticParams",
      err.message
    );
  }
};

export default async function PostDetail({ params }) {
  console.log("\npost)");
  console.log("start:", new Date());

  try {
    const id = params.id;
    const postData = await cachedRead(id);

    if (postData) {
      console.log("end:", new Date());
      return (
        <>
          <section className={styles.pre + ""}>
            <h1 className={styles.title}>{postData.title}</h1>
            <div className={styles.dataWrapper}>
              <Metadata
                name={postData.author.name}
                topic={postData.topic}
                date={postData.wr_date}
                profile_img={postData.author.profile_img}
              />
              <BtnWrapper postData={postData} />
            </div>

            <div className={styles.content}>
              {JSON.parse(postData.content).map((ele, idx) => {
                if (typeof ele === "object") {
                  return <Img key={"img block" + idx} data={ele} />;
                } else if (ele.startsWith("<pre><code")) {
                  return (
                    <CodeBlock key={"code block" + idx} codeString={ele} />
                  );
                } else {
                  return (
                    <div
                      key={"content block" + idx}
                      dangerouslySetInnerHTML={{ __html: sanitize(ele) }}
                    ></div>
                  );
                }
              })}
            </div>
          </section>
          <section className={styles.relate_pre}>
            <h3>Related Posts</h3>
            <ul>
              {new Array(7).fill(null).map((ele, idx) => {
                return (
                  <li
                    className={"skeleton_bg"}
                    key={`relate_placeholder_` + idx}
                  ></li>
                );
              })}
            </ul>
            <RelatedPosts
              wr_date={postData.wr_date}
              uid={postData.author.uid}
              topic={postData.topic}
              title={postData.title}
            />
          </section>
        </>
      );
    } else {
      <span>no data</span>;
    }
  } catch (err) {
    console.error(
      "ERROR(/app/post/[id]/page.js > <PostDetail />) :",
      err.message,
      params.id
    );
    return (
      <section>
        <span>There is an error during fetching Post</span>
      </section>
    );
  }
}

function Metadata({ name, topic, date, profile_img }) {
  return (
    <section className={styles.metadata}>
      <Image
        alt={`profile image of ${name}`}
        src={profile_img}
        width={35}
        height={35}
      ></Image>
      <div>
        <span>{name}</span>
        <span>{`${topic} • ${new Date(date).toString().slice(0, 21)}`}</span>
      </div>
    </section>
  );
}

async function BtnWrapper({ postData }) {
  const session = await auth();

  return (
    <>
      {session && session.user.uid === postData.author.uid && (
        <div className={styles.btns + " type_a"}>
          <BtnEdit targetId={postData._id.toString()} size={22} />
          <BtnDelete
            topic={postData.topic}
            url={
              process.env.NEXT_PUBLIC_URL_POST + `/${postData._id.toString()}`
            }
            size={20}
          />
        </div>
      )}
    </>
  );
}
