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
  try {
    const pagingData = await paging();

    return (
      <Board
        pagingData={pagingData}
        type={""}
        isPagination={false}
        query={null}
      />
    );
  } catch (err) {
    console.error(err.message);
    return <span>There is an error during fetching Articles</span>;
  }
}
