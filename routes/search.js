const express = require("express");
const router = express.Router();

router.get("/profiles", (req, res, next) => {
  res.render("user/profiles", { user: req.user });
  console.log(req.user);
});

module.exports = router;
