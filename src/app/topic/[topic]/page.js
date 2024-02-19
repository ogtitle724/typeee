import Board from "@comps/board/board";
import { getPosts } from "@/util/api";

export default async function Topic({ params }) {
  const pagingData = await getPosts({
    topic: params.topic,
    page: 1,
    select: "_id title summary topic",

    size: 30,
  });

  return (
    <>
      <Board posts={pagingData} type={"list"} />
    </>
  );
}
