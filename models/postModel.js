const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  commentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  commentedAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }],
    comment: [commentSchema],
    image: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
