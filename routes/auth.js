console.log("Auth.js is loaded");

//holds all the routes for login

require("dotenv").config();

const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const flash = require("connect-flash");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res) => {
  console.log("login clicked");
  console.log(req.user);
  //flash doesnt seem to work
  res.render("auth/login", { message: req.flash("error") });
});

//post route from login with authenticate
// router.post("/login", passport.authenticate("local"), (req, res) => {
//   // console.log(req.user);
//   // {
//   //   user: req.user;
//   // }
//   res.redirect("profile/show");
//   // res.redirect();
// });

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "profile/:id/show",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// passport.use(new LocalStrategy({
//   passReqToCallback: true
// }, (req, username, password, next) => {
//   User.findOne({ username }, (err, user) => {
//     // ...

//local signup
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (email === "" || password === "") {
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
      password: hashPass
    })
      .then(user => {
        console.log("user", user);
        res.redirect("/login");
      })
      .catch(err => console.log(err));
  });
});

//linkedin authentication
router.get("/auth/linkedin", passport.authenticate("linkedin"));

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  function(req, res) {
    console.log("success");
    // Successful authentication, redirect to profile.
    let profileid = "/profile/" + req.user._id + "/show";
    res.redirect(profileid);
  }
);

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
