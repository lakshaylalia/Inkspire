const postModel = require("../models/postModel.js");
const userModel = require("../models/userModel.js");

module.exports.addPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content)
      return res.status(400).send({ message: "Content is required" });

    const id = req.session.user.id;
    const user = await userModel.findOne({ _id: id });

    const postData = {
      content,
      owner: id,
      image: req.file ? req.file.buffer : undefined,
    };

    const post = await postModel.create(postData);

    user.posts.push(post._id);
    await user.save();
    res.redirect("/user/posts/all-posts");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("owner", "username image")
      .sort({ createdAt: -1 });

    res.render("posts", { posts });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong, please try again" });
  }
};

module.exports.renderEditPost = async (req, res) => {
  try {
    let id = req.params.id;
    let post = await postModel.findOne({ _id: id });
    res.render("editPost", { post });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again" });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;

    let post = await postModel.findById(id);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const { content } = req.body;

    const updatedPost = {
      content: content || post.content,
      image: req.file && req.file.buffer ? req.file.buffer : post.image,
    };

    const updated = await postModel.findByIdAndUpdate(id, updatedPost, {
      new: true,
      runValidators: true,
    });

    await updated.save();

    res.status(200).redirect("/user/profile");
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again" });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    let email = req.session.user.email;

    await postModel.findOneAndDelete({ _id: id });
    let user = await userModel.findOneAndUpdate(
      { email: email },
      {
        $pull: {
          posts: id,
        },
      }
    );

    res.status(200).redirect("/user/profile");
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again" });
  }
};

module.exports.likePost = async (req, res) => {
  try {
    const id = req.params.id;

    let post = await postModel.findOneAndUpdate(
      { _id: id },
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.status(200).json({ likes: post.likes });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong, please try again" });
  }
};
