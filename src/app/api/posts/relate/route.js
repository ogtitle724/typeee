import { relate } from "@/service/mongoDB/mongoose_post";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const wr_date = searchParams.get("wr_date");
    const uid = searchParams.get("uid");
    const topic = searchParams.get("topic");
    const relatePosts = await relate(wr_date, uid, topic);
    let prevPosts = relatePosts.prevPosts;
    let nextPosts = relatePosts.nextPosts.reverse();

    if (prevPosts.length < 3) {
      nextPosts = nextPosts.slice(-(6 - prevPosts.length));
    } else if (nextPosts.length < 3) {
      prevPosts = prevPosts.slice(0, 6 - nextPosts.length);
    } else {
      prevPosts = prevPosts.slice(0, 3);
      nextPosts = nextPosts.slice(-3);
    }

    return new Response(JSON.stringify({ prevPosts, nextPosts }), {
      status: 200,
    });
  } catch (err) {
    console.error("ERROR(/api/posts/relate.js > GET)", err.message);
    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}
