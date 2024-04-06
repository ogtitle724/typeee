import Board from "./_components/board/basic/board";
import fetchIns from "@/lib/fetch";
import { getMetadata } from "@/config/metadata";

export const metadata = getMetadata();

export default async function Home() {
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
        <Board
          pagingData={pagingData}
          isList={false}
          isPagination={false}
          query={null}
        />
      </>
    );
  } catch (err) {
    console.error(err.message);
    return <span>There is an error during fetching Posts</span>;
  }
}
