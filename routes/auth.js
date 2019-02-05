console.log("Auth.js is loaded");

//holds all the routes for login

require("dotenv").config();

const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");

const bcrypt = require("bcrypt");
const bryptSalt = 10;

router.get("/login", (req, res) => {
  console.log("login clicked");
  console.log(req.user);
  res.render("auth/login", { message: req.flash("error") });
});

//post route from login with authenticate
router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(req.user);
  //{ user: req.user }
  res.redirect("profile/edit");
  // res.redirect();
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "profile/edit",
//     failureRedirect: "auth/login",
//     failureFlash: true,
//     passReqToCallback: true
//   })
// );

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (email === "" || password === "" || username === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The email already exists" });
      return;
    }

    console.log("user", user);

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      firstName,
      lastName,
      email,
      //password
      password: hashPass
    })
      .then(user => {
        console.log("user", user);
        console.log("this shit worked yo!");
        res.redirect("/login");
      })
      .catch(err => console.log(err));
  });
});

router.get("/auth/linkedin", passport.authenticate("linkedin"));

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  function(req, res) {
    console.log("success");
    // Successful authentication, redirect to profile.

    res.redirect("/profile/show");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
