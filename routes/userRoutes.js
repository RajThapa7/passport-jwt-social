const express = require("express");
const router = express.Router();

router.get("/secret", (req, res) => {
  res.json({ msg: "welcome to the forbidden home page" });
});

module.exports = router;
