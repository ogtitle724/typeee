import { paging } from "@/service/mongoDB/mongoose_post";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);

  try {
    const page = searchParams.get("page");
    const query = searchParams.get("query");

    const pagingData = await paging(JSON.parse(query), page);

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
