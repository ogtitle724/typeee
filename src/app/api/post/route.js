import { create } from "@/service/mongoDB/mongoose_post";
import { copyFile } from "@/service/aws/s3";
import { getImgDirs } from "@/lib/text";
import { sanitize } from "@/lib/secure";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const regexCode = /(<pre><code.*?>.*?<\/code><\/pre>)/gs;
    const data = await req.json();
    const session = await auth();

    if (!data.author.name) throw new Error("no author name");
    if (!session.user || session.user.uid !== data.author.uid) {
      throw new Error("Unauthorized for update");
    }

    data.title = sanitize(data.title);
    data.content = sanitize(data.content);
    data.tags = data.tags.map((tag) => sanitize(tag));

    const imgDirs = getImgDirs(data.content);

    if (imgDirs) {
      for (const dir of imgDirs) {
        const newDir = dir.replace("/temp", "");

        await copyFile(dir, newDir);
        data.content = data.content.replace(dir, newDir);

        if (!data.thumbnail)
          data.thumbnail = process.env.AWS_S3_BUCKET_URL + `/${newDir}`;
      }
    }

    data.content = JSON.stringify(data.content.split(regexCode));

    const newPost = await create(data);
    return new Response(JSON.stringify(newPost), { status: 200 });
  } catch (err) {
    console.error("Error(api/post/route.js > POST) :", err.message);
    return new Response(err.message, { status: 500 });
  }
}
