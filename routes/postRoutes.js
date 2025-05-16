const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config.js");
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");
const {addPost, getAllPosts, renderEditPost, updatePost, deletePost, likePost} = require('../controllers/postController.js');

router.post('/add-post', upload.single('image'), isAuthenticated, addPost);

router.get('/all-posts', isAuthenticated, getAllPosts)

router.get('/edit/:id', isAuthenticated, renderEditPost);

router.post('/update/:id', upload.single('image'), isAuthenticated, updatePost);

router.get('/delete/:id', isAuthenticated, deletePost);

router.post('/all-posts/like/:id', isAuthenticated, likePost)

module.exports = router;