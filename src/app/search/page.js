import Board from "@comps/board/board";
import styles from "./searchpage.module.css";
import fetchIns from "@/lib/fetch";

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
        <Board
          pagingData={pagingData}
          type={"list"}
          isPagination={true}
          query={JSON.stringify(query)}
        />
      </>
    );
  } catch (err) {
    console.error(err.message);
    return <span>There is an error during fetching Posts</span>;
  }
}
