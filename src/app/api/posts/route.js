import { paging } from "@/service/mongoDB/mongoose_post";

export async function GET(req, { params }) {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const query = JSON.parse(url.searchParams.get("query"));

    const pagingData = await paging(query, page);
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
