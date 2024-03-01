import { paging } from "@/service/mongoDB/mongoose_post";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const [topic, page, select, size] = [
    searchParams.get("topic"),
    searchParams.get("page"),
    searchParams.get("select"),
    searchParams.get("size"),
  ];

  try {
    const pagingData = await paging(topic, page, select, size);

    return new Response(JSON.stringify(pagingData), {
      status: 200,
    });
  } catch (err) {
    console.error(err.message);

    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}
