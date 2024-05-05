import Link from "next/link";
import BtnDelete from "@comps/btn/delete/delete";
import BtnEdit from "@/app/_components/btn/edit/edit";
import Image from "next/image";
import CodeBlock from "@/app/_components/code/code";
import { sanitize } from "@/lib/secure";
import { relate } from "@/service/mongoDB/mongoose_post";
import { auth } from "@/auth";
import { getMetadata } from "@/config/metadata";
import styles from "./postDetail.module.css";

export const generateMetadata = async ({ params }) => {
  try {
    const url = process.env.NEXT_PUBLIC_URL_POST + `/${params.id}`;
    const options = {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { tags: ["post"] },
    };
    const res = await fetch(url, options);
    const postData = await res.json();

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

/* export const generateStaticParams = async () => {
  try {
    const select = "_id";
    const url =
      process.env.NEXT_PUBLIC_URL_PAGING +
      `?page=${1}&query=${JSON.stringify({})}&select=${select}&size=Infinity`;
    const options = {
      method: "GET",
      headers: { Accept: "application/json" },
    };

    const res = await fetch(url, options);
    console.log(res);
    const { posts } = await res.json();
    console.log(posts);
    return posts || [];
  } catch (err) {
    console.error(
      "ERROR(/app/post/[id]/page.js) > generateStaticParams",
      err.message
    );
  }
}; */

export default async function PostDetail({ params }) {
  try {
    const url = process.env.NEXT_PUBLIC_URL_POST + `/${params.id}`;
    const options = {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { tags: ["post"] },
    };

    const res = await fetch(url, options);
    const postData = await res.json();

    if (postData) {
      const relatePosts = await relate(
        postData.wr_date,
        postData.author.id,
        postData.topic
      );

      let prevPosts = relatePosts.prevPosts;
      let nextPosts = relatePosts.nextPosts.reverse();

      if (prevPosts.length < 3) {
        nextPosts = nextPosts.slice(-(6 - prevPosts.length));
      } else if (nextPosts.length < 3) {
        prevPosts = prevPosts.slice(0, 6 - nextPosts.length);
      } else {
        prevPosts = prevPosts.slice(0, 3);
        nextPosts = nextPosts.slice(-3);
      }

      const regexCode = /(<pre><code.*?>.*?<\/code><\/pre>)/gs;
      const splited = postData.content.split(regexCode);

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
              {splited.map((html, idx) => {
                if (html.startsWith("<pre><code")) {
                  return (
                    <CodeBlock key={"code block" + idx} codeString={html} />
                  );
                } else {
                  return (
                    <div
                      key={"content block" + idx}
                      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
                    ></div>
                  );
                }
              })}
            </div>
          </section>
          <RelatedPosts
            nextPosts={nextPosts}
            prevPosts={prevPosts}
            title={postData.title}
          />
        </>
      );
    } else {
      <span>no data</span>;
    }
  } catch (err) {
    console.error(
      "ERROR(/app/post/[id]/page.js > <Content />) :",
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

function RelatedPosts({ nextPosts, prevPosts, title }) {
  return (
    <section id="here" className={styles.relatePosts}>
      <h3>Related Posts</h3>
      <ul>
        {nextPosts.map((nextPost, idx) => {
          return (
            <li className={styles.next} key={`next post ${idx}`}>
              <Link href={`/post/${nextPost._id}`}>{nextPost.title}</Link>
            </li>
          );
        })}
        {<li className={styles.related_cur}>{title}</li>}
        {prevPosts.map((prevPost, idx) => {
          return (
            <li key={`prev post ${idx}`}>
              <Link href={`/post/${prevPost._id}`}>{prevPost.title}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
