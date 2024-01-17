const express = require("express");
const app = express();
require("dotenv").config();
require("./passport.js");

const passport = require("passport");
const authRouter = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const mongoose = require("mongoose");
const session = require("express-session");
const corsMiddleware = require("./middleware/corsMiddleware.js");

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
  })
);
app.use(passport.initialize());
require("./middleware/auth.js")();
app.use(corsMiddleware());

app.use(authRouter);
app.use("/", passport.authenticate("jwt", { session: false }), userRoutes);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log("Database connected successfully");
  app.listen(4000, () => {
    console.log("Server started.");
  });
});
