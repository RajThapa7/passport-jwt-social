const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
const User = require("../userModel");

exports.login = async function (req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });

    res.app.set("user", user);
    res.redirect(process.env.CLIENT_URL1);
  } catch (error) {
    console.log(error);
  }
};

exports.register = async function (req, res) {
  try {
    const user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
      email: req.body.email,
    });
    res.json({ user, msg: "Successfully created" });
  } catch (error) {
    console.log(error);
  }
};
