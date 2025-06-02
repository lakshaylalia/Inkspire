const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const indexRoutes = require("./routes/indexRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const {isAuthenticated} = require('./middlewares/isAuthenticated.js');
const {isAdmin} = require('./middlewares/isAdmin.js')

require("dotenv").config();
const db = require("./config/mongoose-connection.js");
const userModel = require("./models/userModel.js");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })

);

app.use("/", indexRoutes);
app.use('/user',isAuthenticated, userRoutes);
app.use("/admin", isAdmin, adminRoutes);

app.use((req, res) => {
  res.status(404).render("404");
});



app.listen(port, '0.0.0.0');


// module.exports = app;
