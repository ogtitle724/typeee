import Board from "@/app/_components/board/basic/board";
import styles from "./searchpage.module.css";
import fetchIns from "@/lib/fetch";
import { getMetadata } from "@/config/metadata";

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

    const res = await fetchIns.get(
      process.env.NEXT_PUBLIC_URL_PAGING +
        `?page=${page}&query=${JSON.stringify(query)}`
    );
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
    console.error("ERROR(app/search/page.js > generateMetadata):", err.message);
  }
};

export default async function Topic({ searchParams }) {
  const page = searchParams.page;
  const query = {
    $or: [
      { content: { $regex: searchParams.param, $options: "i" } },
      { title: { $regex: searchParams.param, $options: "i" } },
    ],
  };

  try {
    const res = await fetchIns.get(
      process.env.NEXT_PUBLIC_URL_PAGING +
        `?page=${page}&query=${JSON.stringify(query)}`
    );
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
              isList={true}
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
