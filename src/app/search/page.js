import Board from "@comps/board/basic/board";
import BoardSkeleton from "@/app/_components/skeleton/board/board_skeleton";
import { getMetadata } from "@/config/metadata";
import { Suspense } from "react";
import styles from "./searchpage.module.css";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({ params, searchParams }) => {
  try {
    const page = searchParams.page;
    const query = {
      is_public: true,
      $or: [
        { content: { $regex: searchParams.param, $options: "i" } },
        { title: { $regex: searchParams.param, $options: "i" } },
      ],
    };
    const url =
      process.env.NEXT_PUBLIC_URL_PAGING +
      `?page=${page}&query=${JSON.stringify(query)}`;
    const options = {
      method: "GET",
      headers: { Accept: "application/json" },
    };

    const res = await fetch(url, options);
    const pagingData = await res.json();

    let [description, idx] = ["", 1];

    if (pagingData.posts.length) {
      for (const post of pagingData.posts) {
        description += `(${idx})${post.title} `;

        if (description.length > 160) {
          description = description.slice(0, 157) + "...";
          break;
        } else {
          idx++;
        }
      }
    }

    return getMetadata(
      `'${searchParams.param}' search result`,
      description,
      process.env.URL + `/post/${params.id}`
    );
  } catch (err) {
    console.error("ERROR(/search/page.js > generateMetadata):", err.message);
  }
};

async function Content({ searchParams }) {
  const page = searchParams.page;
  const query = {
    $or: [
      { content: { $regex: searchParams.param, $options: "i" } },
      { title: { $regex: searchParams.param, $options: "i" } },
    ],
  };

  try {
    const url =
      process.env.NEXT_PUBLIC_URL_PAGING +
      `?page=${page}&query=${JSON.stringify(query)}`;
    const options = {
      method: "GET",
      headers: { Accept: "application/json" },
    };

    const res = await fetch(url, options);
    const pagingData = await res.json();

    return (
      <>
        <h1 className={styles.title}>
          <span>search result</span>
          <span>{searchParams.param + ` (${pagingData.totalCnt})`}</span>
        </h1>
        {pagingData.totalCnt ? (
          <>
            <Board
              pagingData={pagingData}
              isPagination={true}
              query={JSON.stringify(query)}
            />
          </>
        ) : (
          <section className={styles.empty}>
            <span>{`There is no search result for '${searchParams.param}'`}</span>
          </section>
        )}
      </>
    );
  } catch (err) {
    console.error(err.message);
    return <span>There is an error during fetching Posts</span>;
  }
}

export default async function Topic({ searchParams }) {
  return (
    <Suspense fallback={<BoardSkeleton />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
