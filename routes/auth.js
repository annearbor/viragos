console.log("I am loaded, auth");

//holds all the routes that have to do with authentication
require("dotenv").config();
//adding passport and linkedin strategy from passport
const passport = require("passport");
const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

//post route from login REDIRECT TO PROFILE WITH REQ.USER
router.post("/login", passport.authenticate("local"), (req, res) => {
  // console.log(req.user);
  //{ user: req.user }
  res.redirect("profile/edit");
  // res.redirect();
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});
router.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The email already exists" });
      return;
    }

    console.log("user", user);

    User.create({
      firstName,
      lastName,
      email,
      password
    })
      .then(user => {
        console.log("user", user);
        console.log("this shit worked yo!");
        res.redirect("/login");
      })
      .catch(err => console.log(err));
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/auth/linkedin", passport.authenticate("linkedin"));

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  function(req, res) {
    console.log("success");
    // Successful authentication, redirect to profile.

    res.redirect("/profile/edit");
  }
);

module.exports = router;
