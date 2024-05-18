import { create } from "@/service/mongoDB/mongoose_post";
import { copyFile } from "@/service/aws/s3";
import { sanitize } from "@/lib/secure";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const regexCode =
      /(<pre><code.*?>.*?<\/code><\/pre>)|(<figure.*?><img.*?><\/figure>)/gs;

    const data = await req.json();
    const session = await auth();

    if (!data.author.name) throw new Error("no author name");
    if (!session.user || session.user.uid !== data.author.uid) {
      throw new Error("Unauthorized for update");
    }

    data.title = sanitize(data.title);
    data.content = sanitize(data.content);
    data.tags = data.tags.map((tag) => sanitize(tag));
    data.content = data.content.split(regexCode).filter((ele) => ele);

    let idx = 0;
    for (let content of data.content) {
      if (content.startsWith("<figure")) {
        const pctMatch = content.match(/width:([0-9\.]+)%/);
        const pct = pctMatch ? pctMatch[1] : 100;
        const ratio = content.match(/style\=\"aspect\-ratio:([0-9\/]+)\"/)[1];
        const tempSrc = content.match(/src=\"([0-9a-z\/\.\:\-]+)\"/)[1];
        const src = tempSrc.replace("/temp", "");
        const width = +content.match(/width="(\d+)"/)[1];
        const height = +content.match(/height="(\d+)"/)[1];

        await copyFile(
          tempSrc.replace(process.env.AWS_S3_BUCKET_URL + "/", ""),
          src.replace(process.env.AWS_S3_BUCKET_URL + "/", "")
        );

        if (!data.thumbnail) {
          data.thumbnail = process.env.AWS_S3_BUCKET_URL + `/${src}`;
        }

        data.content[idx] = { src, ratio, pct, width, height };
      }
      idx++;
    }

    data.content = JSON.stringify(data.content);
    const newPost = await create(data);
    return new Response(JSON.stringify(newPost), { status: 200 });
  } catch (err) {
    console.error("Error(api/post/route.js > POST) :", err.message);
    return new Response(err.message, { status: 500 });
  }
}
