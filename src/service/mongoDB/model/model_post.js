import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    id: String,
    nick: String,
  },
  content: String,
  wr_date: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  re_date: {
    type: Date,
    immutable: false,
    default: () => Date.now(),
  },
  meta: {
    like: Number,
    dislike: Number,
  },
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 1,
  },
  author: {
    id: {
      type: String,
      default: "anonymous",
    },
    nick: {
      type: String,
      default: "anonymous",
    },
  },
  content: {
    type: String,
    minLength: 1,
  },
  summary: {
    type: String,
    minLength: 1,
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  topic: {
    type: String,
    minLength: 1,
  },
  thumbnail: {
    type: String,
    default: "",
  },
  wr_date: {
    type: Date,
    immutable: true,
    default: () => new Date(),
  },
  re_date: {
    type: Date,
    immutable: false,
    default: () => new Date(),
  },
  meta: {
    view_cnt: {
      type: Number,
      default: 0,
    },
    like: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
  },
});

postSchema.pre("save", function (next) {
  this.re_date = new Date();
  next();
});

/* postSchema.pre("findOne", function (next) {
  this.update({}, { $inc: { "meta.view_cnt": 1 } }, { multi: true });
  next();
}); */

//here make vertual method that calc score(best)

const Post = mongoose.models.posts || mongoose.model("posts", postSchema);

export default Post;
