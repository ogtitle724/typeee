import Board from "@comps/board/board";
import { paging } from "@/service/mongoDB/mongoose_post";

export default async function Topic({ params }) {
  const topic = params.topic;
  const page = 1;
  const select = "_id title summary topic";
  const size = 30;

  try {
    const pagingData = await paging(topic, page, select, size);
    return (
      <>
        <Board posts={pagingData} type={"list"} />
      </>
    );
  } catch (err) {
    console.error(err.message);
    return <span>There is an error during fetching Articles</span>;
  }
}
