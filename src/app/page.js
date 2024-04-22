import fetchIns from "@/lib/fetch";
import Board from "@comps/board/basic/board";
import BoardSkeleton from "@comps/skeletion/board/board_skeleton";
import { getMetadata } from "@/config/metadata";
import { Suspense } from "react";

export const metadata = getMetadata();

async function Content() {
  try {
    const query = { is_public: true };
    const res = await fetchIns.get(
      process.env.NEXT_PUBLIC_URL_PAGING +
        `?page=${1}&query=${JSON.stringify(query)}`
    );
    const pagingData = await res.json();

    return (
      <>
        <h1 className="hide">Typeee home page</h1>
        <Board pagingData={pagingData} isPagination={false} query={null} />
      </>
    );
  } catch (err) {
    console.error(err.message);
    return <span>There is an error during fetching Posts</span>;
  }
}

export default function Home() {
  return (
    <>
      <h1 className="hide">Typeee home page</h1>
      <Suspense fallback={<BoardSkeleton />}>
        <Content />
      </Suspense>
    </>
  );
}
