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
    return post;
  } catch (err) {
    console.error(err.message);
  }
}

export async function update(id, data, key) {
  try {
    let post = await Post.findById(id);

    //detect change image
    const prevImgDirs = getImgDirs(post.content);
    let updatedImgDirs = getImgDirs(data.content);

    if (updatedImgDirs) {
      updatedImgDirs = updatedImgDirs.reverse();
    }

    if (prevImgDirs) {
      for (const dir of prevImgDirs) {
        if (!updatedImgDirs.includes(dir)) {
          await deleteFile(dir);
        }
      }
    }

    if (updatedImgDirs) {
      for (const dir of updatedImgDirs) {
        let newDir = dir;

        if (dir.indexOf("/temp") !== -1) {
          newDir = dir.replace("/temp", "");
          await copyFile(dir, newDir);
          data.content = data.content.replace(dir, newDir);
        }

        data.thumbnail = process.env.AWS_S3_BUCKET_URL + `/${newDir}`;
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

export async function paging(
  query = null,
  page = 1,
  select = "_id title summary topic thumbnail",
  size = 30
) {
  try {
    let pagingData = await Post.find(query)
      .select(select)
      .sort({ wr_date: -1 })
      .skip(size * (page - 1))
      .limit(size);

    const newPagingData = pagingData.map((post) => {
      const newPost = {
        id: post._id.toString(),
        title: post.title,
        summary: post.summary,
        topic: post.topic,
        thumbnail: post.thumbnail,
      };

      return newPost;
    });

    const totalCnt = await Post.countDocuments(query);

    const returnValue = {
      posts: newPagingData,
      totalCnt,
      totalPage: ~~((totalCnt - 1) / size) + 1,
    };
    return returnValue;
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

    return { prevPosts, nextPosts };
  } catch (err) {
    console.error(err.message);
  }
}
