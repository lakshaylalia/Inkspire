const express = require("express");
const router = express.Router();
const { login, register, logout } = require("../controllers/authController.js");
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");

router.get("/", isAuthenticated, (req, res) => {
  const articles = [
    {
      id: "1",
      title: "How to Learn JavaScript Effectively",
      author: "Lakshay Lalia",
      date: "May 16, 2025",
      snippet:
        "JavaScript is one of the most popular programming languages. Here is how you can master it quickly...",
    },
    {
      id: "2",
      title: "Understanding Tailwind CSS Basics",
      author: "Jane Doe",
      date: "May 10, 2025",
      snippet:
        "Tailwind CSS makes styling easy and fast by using utility classes...",
    },
   
  ];

  const popularTags = ["JavaScript", "CSS", "WebDev", "React", "NodeJS"];
  const authors = [
    { id: "a1", name: "Lakshay Lalia" },
    { id: "a2", name: "Jane Doe" },
    { id: "a3", name: "John Smith" },
  ];

  res.render("home", { articles, popularTags, authors });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", login);

router.get("/register", (req, res) => {
  res.render("signup");
});

router.post("/register", register);

router.get("/logout", logout);

module.exports = router;
