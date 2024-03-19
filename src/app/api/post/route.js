import { create } from "@/service/mongoDB/mongoose_post";
import { copyFile } from "@/service/aws/s3";

export async function POST(req) {
  const data = await req.json();
  const regex = /<img.*?src=["'](.*?)["']/g;

  const imgTags = data.content.match(regex);
  const imgSrcs = imgTags.map((tag) => {
    const regex = /image[^\s"']+/g;
    const match = tag.match(regex);
    const dest = match[0].replace("/temp", "");

    return [match[0], dest];
  });

  try {
    for (const srcs of imgSrcs) {
      await copyFile(srcs[0], srcs[1]);
    }

    const newPost = await create(data);
    return new Response(JSON.stringify(newPost), {
      status: 200,
    });
  } catch (err) {
    console.error("Error(api/post/route.js > POST) :", err.message);
    return new Response(err.message, { status: 500 });
  }
}
