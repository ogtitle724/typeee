import Board from "@comps/board/basic/board";
import BoardSkeleton from "@/app/_components/skeleton/board/board_skeleton";
import { getMetadata } from "@/config/metadata";
import { Suspense } from "react";

export const metadata = getMetadata();

async function Content({ page }) {
  try {
    const query = { is_public: true };
    const url =
      process.env.NEXT_PUBLIC_URL_PAGING +
      `?page=${page}&query=${JSON.stringify(query)}`;
    const option = {
      method: "GET",
      headers: { Application: "application/json" },
    };

    const res = await fetch(url, option);
    const pagingData = await res.json();

    return (
      <>
        <h1 className="hide">Typeee home page</h1>
        <Board pagingData={pagingData} isPagination={true} query={null} />
      </>
    );
  } catch (err) {
    console.error("ERROR(/page.js > <Content>)", err.message);
    return <span>There is an error during fetching Posts</span>;
  }
}

export default function Home({ searchParams }) {
  const page = searchParams.page || 1;

  return (
    <>
      <h1 className="hide">Typeee home page</h1>
      <Suspense fallback={<BoardSkeleton />}>
        <Content page={page} />
      </Suspense>
    </>
  );
}
