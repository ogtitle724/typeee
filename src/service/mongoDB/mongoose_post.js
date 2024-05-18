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
  console.log("DB READ");
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
    let prevImgUrls = new Set(
      JSON.parse(post.content)
        .filter((ele) => typeof ele === "object")
        .map((ele) => ele.src)
    );
    const regexCode =
      /(<pre><code.*?>.*?<\/code><\/pre>)|(<figure.*?><img.*?><\/figure>)/gs;

    data.thumbnail = null;
    data.content = data.content.split(regexCode).filter((ele) => ele);

    let idx = 0;

    for (let content of data.content) {
      if (content.startsWith("<figure")) {
        const pctMatch = content.match(/width:([0-9\.]+)%/);
        const pct = pctMatch ? pctMatch[1] : 100;
        const ratio = content.match(/style\=\"aspect\-ratio:([0-9\/]+)\"/)[1];
        let src = content.match(/src=\"([0-9a-z\/\.\:\-]+)\"/)[1];
        const width = +content.match(/width="(\d+)"/)[1];
        const height = +content.match(/height="(\d+)"/)[1];

        if (src.includes("/temp")) {
          const newSrc = src.replace("/temp", "");

          await copyFile(
            src.replace(process.env.AWS_S3_BUCKET_URL + "/", ""),
            newSrc.replace(process.env.AWS_S3_BUCKET_URL + "/", "")
          );
          src = newSrc;
        } else {
          prevImgUrls.delete(src);
        }

        if (!data.thumbnail) {
          data.thumbnail = src;
        }

        data.content[idx] = { src, ratio, pct, width, height };
      }
      idx++;
    }

    for (const url of prevImgUrls) {
      console.log(url);
      await deleteFile(url.replace(process.env.AWS_S3_BUCKET_URL + "/", ""));
    }

    data.content = JSON.stringify(data.content);
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "object") {
        post[key] = structuredClone(data[key]);
      } else {
        post[key] = data[key];
      }
    });

    await post.save();
    return post;
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
  select = "_id title summary topic thumbnail tags author",
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
      pagingData = await Post.find(query).select(select).sort({ wr_date: -1 });
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
    console.error(
      "ERROR(app/service/mongoDB/mongoose_post.js > paging):",
      err.message
    );
  }
}

export async function relate(date, uid, topic) {
  try {
    const prevPosts = await Post.find({
      $and: [
        { wr_date: { $lt: date } },
        { "author.uid": uid },
        { topic },
        { is_public: true },
      ],
    })
      .select("title wr_date _id")
      .sort({ wr_date: -1 })
      .limit(6);

    const nextPosts = await Post.find({
      $and: [
        { wr_date: { $gt: date } },
        { "author.uid": uid },
        { topic },
        { is_public: true },
      ],
    })
      .select("title wr_date _id")
      .sort({ wr_date: 1 })
      .limit(6);

    return { prevPosts, nextPosts };
  } catch (err) {
    console.error(err.message);
  }
}
