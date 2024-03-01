import { update, read, del, relate } from "@/service/mongoDB/mongoose_post";

export async function GET(req, { params }) {
  const id = params.id;
  const postData = await read(id);

  const relatePosts = await relate(
    postData.wr_date,
    postData.author.id,
    postData.topic
  );
  const responseData = {
    postData,
    relatePosts,
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
  });
}

export async function PATCH(req, { params }) {
  try {
    const id = params.id;
    const data = await req.json();
    const updatedPost = await update(id, data);

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
    });
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}
