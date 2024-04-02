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

    if (prevImgDirs) {
      for (const dir of prevImgDirs) {
        if (updatedImgDirs && !updatedImgDirs.includes(dir)) {
          await deleteFile(dir);
        }
      }
    }

    if (updatedImgDirs) {
      data.thumbnail = null;

      for (const dir of updatedImgDirs) {
        let newDir = dir;

        if (dir.indexOf("/temp") !== -1) {
          newDir = dir.replace("/temp", "");
          await copyFile(dir, newDir);
          data.content = data.content.replace(dir, newDir);
        }

        if (!data.thumbnail)
          data.thumbnail = process.env.AWS_S3_BUCKET_URL + `/${newDir}`;
      }
    } else {
      data.thumbnail = null;
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
    console.error(
      "ERROR(/service/mongoDB/mongoose_post.js > update):",
      err.message
    );
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
  page = 1,
  query = null,
  select = "_id title summary topic thumbnail",
  size = process.env.NEXT_PUBLIC_PAGING_SIZE
) {
  try {
    let pagingData;

    if (size !== Infinity) {
      pagingData = await Post.find(query)
        .select(select)
        .sort({ wr_date: -1 })
        .skip(size * (page - 1))
        .limit(size);
    } else {
      pagingData = await Post.find(query)
        .select("_id re_date")
        .sort({ wr_date: -1 });
    }

    const newPagingData = pagingData.map((post) => {
      const newPost = Object.entries(post._doc).reduce((acc, [key, value]) => {
        if (key === "_id") acc.id = value.toString();
        else acc[key] = value;
        return acc;
      }, {});
      return newPost;
    });

    const totalCnt = await Post.countDocuments(query);

    const returnValue = {
      posts: newPagingData,
      totalCnt,
      totalPage:
        ~~((totalCnt - 1) / (size || process.env.NEXT_PUBLIC_PAGING_SIZE)) + 1,
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
