import Board from "@comps/board/board";
import fetchIns from "@/lib/fetch";
import { getMetadata } from "@/config/metadata";

export const generateMetadata = async ({ params, searchParams }) => {
  try {
    const query = { topic: params.topic };
    const page = searchParams.page;

    const res = await fetchIns.get(
      process.env.NEXT_PUBLIC_URL_PAGING +
        `?page=${page}&query=${JSON.stringify(query)}`
    );
    const pagingData = await res.json();

    let [description, idx] = ["", 1];

    if (pagingData.posts.length) {
      for (const post of pagingData.posts) {
        description += `(${idx})${post.title} `;

        if (description.length > 160) {
          description = description.slice(0, 157) + "...";
          break;
        } else {
          idx++;
        }
      }
    }

    return getMetadata(
      `${params.topic} related posts page ${page}`,
      description,
      process.env.URL + `/post/${params.id}`
    );
  } catch (err) {
    console.error(
      "ERROR(app/topic/[topic]/page.js > generateMetadata):",
      err.message
    );
  }
};

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
        <h1 className="hide">{`${params.topic} related posts page ${page}`}</h1>
        <Board
          pagingData={pagingData}
          isList={true}
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
