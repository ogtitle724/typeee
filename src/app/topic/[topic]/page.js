import Board from "@comps/board/board";
import fetchIns from "@/lib/fetch";

export default async function Topic({ params, searchParams }) {
  const query = { topic: params.topic };
  const page = searchParams.page;

  try {
    const res = await fetchIns.get(
      process.env.NEXT_PUBLIC_URL_PAGING +
        `?page=${page}&query=${JSON.stringify(query)}`
    );
    const pagingData = await res.json();

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
    return <span>There is an error during fetching Posts</span>;
  }
}
