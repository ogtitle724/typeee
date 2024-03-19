import { create } from "@/service/mongoDB/mongoose_post";
import { copyFile } from "@/service/aws/s3";
import { getImgDirs } from "@/lib/text";

export async function POST(req) {
  try {
    const data = await req.json();
    const imgDir = getImgDirs(data.content);

    if (imgDir) {
      for (const dir of imgDir) {
        const newDir = dir.replace("/temp", "");
        await copyFile(dir, newDir);
        data.content = data.content.replace(dir, newDir);
      }
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
