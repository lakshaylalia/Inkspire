const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config.js");
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");
const {isAdmin} = require("../middlewares/isAdmin.js")
const {
  addPost,
  renderAllPosts,
  renderEditPost,
  updatePost,
  deletePost,
  likePost,
  renderCommmentPost,
  addComment,
  renderAllComments,
  getAllPosts
} = require("../controllers/postController.js");

router.post("/add-post", upload.single("image"), isAuthenticated, addPost);

router.get("/all-posts", isAuthenticated, renderAllPosts);

router.get("/edit/:id", isAuthenticated, renderEditPost);

router.post("/update/:id", upload.single("image"), isAuthenticated, updatePost);

router.get("/delete/:id", isAuthenticated, deletePost);

router.post("/all-posts/like/:id", isAuthenticated, likePost);

router.get("/comment/:id", isAuthenticated, renderCommmentPost);

router.post("/comment/add/:id", isAuthenticated, addComment);

router.get("/all-comments/:id", isAuthenticated, renderAllComments);

router.get('/get-all-posts', isAdmin, isAuthenticated, getAllPosts);

module.exports = router;
