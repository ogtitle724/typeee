import Board from "@comps/board/board";
import { paging } from "@/service/mongoDB/mongoose_post";

export default async function Topic({ params, searchParams }) {
  const query = { topic: params.topic };
  const page = searchParams.page;

  try {
    const pagingData = await paging(query, page);
    return (
      <>
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
    return <span>There is an error during fetching Articles</span>;
  }
}
