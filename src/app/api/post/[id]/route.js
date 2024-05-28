import { update, read, del } from "@/service/mongoDB/mongoose_post";
import { auth } from "@/auth";
import { sanitize } from "@/lib/secure";
import { getImgDirs } from "@/lib/text";
import { deleteFile } from "@/service/aws/s3";

export async function GET(req, { params }) {
  try {
    const id = params.id;
    const postData = await read(id);

    return new Response(JSON.stringify(postData), {
      status: 200,
    });
  } catch (err) {
    console.error("Error(api/post/route.js > GET) :", err.message);
    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = params.id;
    const data = await req.json();
    const session = await auth();

    if (!session.user || session.user.uid !== data.author.uid) {
      throw new Error("Unauthorized for update");
    }

    data.title = sanitize(data.title);
    data.tags = data.tags.map((tag) => sanitize(tag));
    data.content = sanitize(data.content);

    const updatedPost = await update(id, data, session.user.uid);

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
    });
  } catch (err) {
    console.error("Error(api/post/route.js > PATCH) :", err.message);
    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const postData = await read(id);
    const imgDirs = JSON.parse(postData.content)
      .filter((ele) => typeof ele === "object")
      .map((ele) => {
        const urlObj = new URL(ele.src);
        const path = urlObj.pathname;
        const objKey = path.startsWith("/") ? path.substring(1) : path;
        console.log("HHH", ele, objKey);
        return objKey;
      });

    await del(id);
    await Promise.all(imgDirs.map((dir) => deleteFile(dir)));

    return new Response(JSON.stringify("Delete completed"), {
      status: 200,
    });
  } catch (err) {
    console.error("Error(api/post/route.js > DELETE) :", err.message);
    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}
