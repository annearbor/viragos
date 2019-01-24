const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/profile", (req, res, next) => {
  res.render("profilepro");
});

router.post("/profile", (req, res, next) => {
  const { firstName, lastName, role, summary } = req.body;
  console.log(firstName);

  const newUser = new User({ firstName, lastName, role, summary });

  newUser
    .save()
    .then(user => {})
    .catch(error => {
      res.render("error");
    });
});

module.exports = router;
