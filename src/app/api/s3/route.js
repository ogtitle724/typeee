import { NextResponse } from "next/server";
import { uploadFileToS3 } from "@/service/aws/s3";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const date = new Date();
    const t = date.getTime();
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const d = date.getUTCDate();

    const dir = `image/temp/${y}/${m + 1}/${d}/${t}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const src = await uploadFileToS3(buffer, dir);

    return NextResponse.json({
      success: true,
      src,
    });
  } catch (err) {
    console.error("ERROR(/api/s3 > POST):", err.message);
    return NextResponse.json({ err });
  }
}
