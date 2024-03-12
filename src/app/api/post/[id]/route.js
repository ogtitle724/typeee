import { update, read, del } from "@/service/mongoDB/mongoose_post";

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
    const session = true;
    let updatedPost;

    if (!session) {
      console.log("no sessino update");
      updatedPost = await update(id, data, data.author.pwd);
    } else {
      console.log("with sessino update");
      updatedPost = await update(id, data, session.user.uid);
    }

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
    await del(id);

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
