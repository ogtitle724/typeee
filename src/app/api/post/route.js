import { create } from "@/service/mongoDB/mongoose_post";

export async function POST(req) {
  const data = await req.json();

  try {
    const newPost = await create(data);
    return new Response(JSON.stringify(newPost), {
      status: 200,
    });
  } catch (err) {
    console.error("Error(api/post/route.js > POST) :", err.message);
    return new Response(err.message, { status: 500 });
  }
}
