import { update, read, del } from "@/service/mongoDB/mongoose";

export async function GET(req, { params }) {
  const id = params.id;
  const postData = await read(id);

  return new Response(JSON.stringify(postData), {
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
  } catch (err) {
    console.error(err.message);
    return new Response(JSON.stringify(err.message), {
      status: 500,
    });
  }
}
