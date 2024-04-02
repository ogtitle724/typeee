import { paging } from "@/service/mongoDB/mongoose_post";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);

  try {
    const page = searchParams.get("page");
    const select = searchParams.get("select");
    const size = +searchParams.get("size");
    let query = searchParams.get("query");

    if (query) query = JSON.parse(query);

    const params = [page, query, select, size].filter((ele) => ele);
    const pagingData = await paging(...params);

    return new Response(JSON.stringify(pagingData), {
      status: 200,
    });
  } catch (err) {
    console.error("Error(api/posts/route.js > GET) :", err.message);
    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}
