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

module.exports.renderAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("owner", "username image")
      .sort({ createdAt: -1 });
    const userId = req.session.user.id;
    let user = await userModel.findOne({ _id: userId });
    let following = user.following;
    res.render("posts", { posts, userId, following});
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong, please try again" });
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    let posts = await postModel
      .find()
      .populate("owner", "username image")
      .sort({ createdAt: -1 });

    posts = posts.map(post => {
      const postObj = post.toObject(); 

      if (postObj.owner.image) {
        postObj.owner.imageBase64 = postObj.owner.image.toString("base64");
        delete postObj.owner.image; 
      }
      return postObj;
    });

    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong, please try again" });
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
    const userId = req.session.user.id;
    let liked;

    let post = await postModel.findOne({ _id: id });
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      liked = false;
    } else {
      post.likes.push(userId);
      liked = true;
    }
    await post.save();

    res.status(200).json({ likes: post.likes.length, liked });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Something went wrong, please try again" });
  }
};

module.exports.renderCommmentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user.id;
    let post = await postModel
      .findOne({ _id: postId })
      .populate("owner")
      .populate("comment.commentedBy");
    res.status(200).render("comments", { post, userId });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong, please try again" });
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user.id;
    const { content } = req.body;

    if (!content)
      return res.status(400).send({ message: "Content is required" });

    const comment = {
      text: content,
      commentedBy: userId,
    };

    let post = await postModel.findOne({ _id: postId });
    post.comment.push(comment);

    await post.save();
    res.status(200).send({ message: "Comment Added Successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong, PLease Try again later" });
  }
};

module.exports.renderAllComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user.id;
    let post = await postModel
      .findOne({ _id: postId })
      .populate("owner")
      .populate("comment.commentedBy");
    res.status(200).json({ post, userId });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong, please try again" });
  }
};
