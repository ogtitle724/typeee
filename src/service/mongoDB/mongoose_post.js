import mongoose from "mongoose";
import Post from "./model/model_post";
import { getImgDirs } from "@/lib/text";
import { deleteFile, copyFile } from "@/service/aws/s3";

mongoose.connect(process.env.CONN_STRING);

export async function create(data) {
  try {
    const newPost = await Post.create(data);

    await newPost.save();
    return newPost;
  } catch (err) {
    console.error(err.message);
  }
}

export async function read(id) {
  try {
    let post = await Post.findById(id);
    return JSON.parse(JSON.stringify(post));
  } catch (err) {
    console.error(err.message);
  }
}

export async function update(id, data, key) {
  try {
    let post = await Post.findById(id);

    //detect change image
    const prevImgDirs = getImgDirs(post.content);
    const updatedImgDirs = getImgDirs(data.content);

    for (const dir of prevImgDirs) {
      if (!updatedImgDirs.includes(dir)) {
        await deleteFile(dir);
      }
    }

    for (const dir of updatedImgDirs) {
      if (dir.indexOf("/temp") !== -1) {
        const newDir = dir.replace("/temp", "");
        await copyFile(dir, newDir);
        data.content = data.content.replace(dir, newDir);
      }
    }

    if (key === post.author.uid) {
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "object") {
          post[key] = structuredClone(data[key]);
        } else {
          post[key] = data[key];
        }
      });

      await post.save();
      return post;
    } else {
      throw new Error("Unauthorized for update");
    }
  } catch (err) {
    console.error(err.message);
  }
}

export async function del(id) {
  try {
    await Post.deleteOne({ _id: id });
  } catch (err) {
    console.error(err.message);
  }
}

export async function paging(topic, page, select, size) {
  try {
    let pagingData;

    if (topic) {
      pagingData = await Post.find({ topic })
        .select(select)
        .sort({ wr_date: -1 })
        .skip(size * (page - 1))
        .limit(size);
    } else {
      pagingData = await Post.find()
        .select(select)
        .sort({ wr_date: -1 })
        .skip(size * (page - 1))
        .limit(size);
    }

    return JSON.parse(JSON.stringify(pagingData));
  } catch (err) {
    console.error(err.message);
  }
}

export async function relate(date, id, topic) {
  try {
    const prevPosts = await Post.find({
      $and: [{ wr_date: { $lt: date } }, { "author.id": id }, { topic }],
    })
      .select("title wr_date _id")
      .sort({ wr_date: -1 })
      .limit(6);

    const nextPosts = await Post.find({
      $and: [{ wr_date: { $gt: date } }, { "author.id": id }, { topic }],
    })
      .select("title wr_date _id")
      .sort({ wr_date: 1 })
      .limit(6);

    return JSON.parse(JSON.stringify({ prevPosts, nextPosts }));
  } catch (err) {
    console.error(err.message);
  }
}
