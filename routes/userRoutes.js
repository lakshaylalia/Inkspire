const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");
const {
  updateProfile,
  updateImage,
  getProfile,
  renderEditProfile,
  deleteAccount,
  displayUser,
  getAllUsers,
  handleFollow
} = require("../controllers/userController.js");
const upload = require("../config/multer-config.js");
const postRouter = require("./postRoutes.js");
const { isAdmin } = require("../middlewares/isAdmin.js");

router.use("/posts", postRouter);

router.get("/", isAuthenticated, (req, res) => {
 res.send("User");
});

router.get("/profile", isAuthenticated, getProfile);

router.post("/update-image", upload.single("image"), isAuthenticated, updateImage);

router.get("/edit-profile", isAuthenticated, renderEditProfile);

router.post("/profile/update", upload.single("image"), isAuthenticated, updateProfile);

router.get("/delete-account/:id", isAuthenticated, deleteAccount);

router.get("/profile/:id", isAuthenticated, displayUser);

router.get("/all-users", isAdmin, getAllUsers);

router.get("/handle-follow/:id", isAuthenticated, handleFollow);

module.exports = router;
