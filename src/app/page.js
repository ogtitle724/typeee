import Board from "@comps/board/board";
import { paging } from "@/service/mongoDB/mongoose_post";

/* export const generateMetadata = async (props) => {
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
 */
export default async function Home() {
  const topic = "";
  const page = 1;
  const select = "_id title summary topic";
  const size = 30;

  try {
    const pagingData = await paging(topic, page, select, size);
    return <Board posts={pagingData} type={""} />;
  } catch (err) {
    console.error(err.message);
    return <span>There is an error during fetching Articles</span>;
  }
}
