const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("concept", (req, res, next) => {
  res.render("/our-concept");
});

router.get("about", (req, res, next) => {
  res.render("/about-us");
});

module.exports = router;
