import Board from "@comps/board/board";
import { getPosts } from "@/lib/api";

export const generateMetadata = async (props) => {
  const topic = props.params.topic;
  const querys = props.searchParams;

  const pagingData = await getPosts({
    topic: "",
    page: 1,
    select: "_id title summary topic",
    size: 30,
  });

  return;
};

export default async function Home() {
  const pagingData = await getPosts({
    topic: "",
    page: 1,
    select: "_id title summary topic",

    size: 30,
  });

  return (
    <>
      <Board posts={pagingData} type={""} />
    </>
  );
}
