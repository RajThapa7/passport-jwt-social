var express = require("express");
var passport = require("passport");
const jwt = require("jwt-simple");

var router = express.Router();

router.get("/login/facebook", passport.authenticate("facebook"));

router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    res.app.set("user", req.user);
    res.redirect(process.env.CLIENT_URL1);
  }
);

router.post("/logout", function (req, res) {
  res.app.set("user", "");
  res.json({ msg: "logged out successfully" });
});

//call this endpoint from the frontend to using useEffect to check if login is successful or not
router.get("/auth/success", (req, res) => {
  const user = req.app.get("user");
  if (!user) {
    return res.status(401).json({ msg: "You are currently not logged in" });
  }
  const payload = {
    id: user._id,
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  const token = jwt.encode(payload, process.env.JWT_SECRET);
  res.json({ msg: "logged in", user, token });
});

//called on login failure
router.get("/auth/failure", (req, res) => {
  res.status(401).json({ msg: "failed to login" });
});

//google
router.get("/login/google", passport.authenticate("google"));
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    res.app.set("user", req.user);
    res.redirect(process.env.CLIENT_URL1);
  }
);

module.exports = router;
