import Board from "@comps/board/board";
import { paging } from "@/service/mongoDB/mongoose_post";
import styles from "./searchpage.module.css";

export default async function Topic({ searchParams }) {
  const query = {
    $or: [
      { content: { $regex: searchParams.param, $options: "i" } },
      { title: { $regex: searchParams.param, $options: "i" } },
    ],
  };

  try {
    const pagingData = await paging(query);

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
