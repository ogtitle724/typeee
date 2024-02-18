import Board from "@comps/board/board";
import { getPosts } from "@/util/api";

export default async function Home() {
  const pagingData = await getPosts({
    topic: "",
    page: 1,
    size: 30,
  });

  return (
    <>
      <Board posts={pagingData} type={""} />
    </>
  );
}
