const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/isAdmin.js");
const adminModel = require("../models/adminModel.js");

router.post("/createAdmin", async (req, res) => {
  let { email, password, isAdmin } = req.body;
  try {
    let admin = await adminModel.create({ email, password, isAdmin });
    res.status(200).send("created successfully");
  } catch (err) {
    res.send(err);
  }
});

router.get("/", isAdmin, (req, res) => {
  res.send("Admin Pannel");
});

module.exports = router;
