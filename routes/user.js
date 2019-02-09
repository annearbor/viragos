const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

router.get("/profile/edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  // console.log(req.user);
  console.log("this is a GET call");
  res.render("user/edit", { user: req.user }); // show the edit page, data can be edited here
});

//figure out which properties should not be overwritten!!
router.post(
  "/profile/edit",
  ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      //password,
      role,
      currentPosition,
      currentCompany,
      currentIndustry,
      summary,
      headline,
      //picture,
      location
    } = req.body;
    let languages = req.body.languages;
    let interests = req.body.interests;

    console.log("LANGUAGESSSSSSS", typeof languages);
    console.log("Interestsssss", typeof interests);

    // if (typeof languages !== Array) {
    //   languages = [languages];
    // }

    if (typeof interests !== Array) {
      interests = [interests];
    }

    console.log("THIS IS THE REQ.BODZ", req.body);

    console.log("LANGUAGESSSSSSS", typeof languages);
    console.log("THIS IS THE REQ USER", req.user);

    //this only works for linke din users / separate find and update
    User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          firstName,
          lastName,
          email,
          //password,
          role,
          currentPosition,
          currentCompany,
          currentIndustry,
          summary,
          headline,
          location,
          interests,
          languages
        }
      }
    )
      .then(user => {
        // console.log("user", user);
        res.redirect("/profile/:id/show");
      })
      .catch(err => console.log(err));
  }
);

router.get(
  "/profile/:_id/show",
  ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    User.findById(req.params._id).then(user => {
      user.isMentor = user.role === "Mentor";
      user.isMentee = user.role === "Mentee";

      if (user._id == req.user._id) {
        user.isOwner = true;
        console.log("USER IS OWNER!", user.isOwner);
      }
      console.log("USER_ID", user._id);
      console.log("REQ.USER_ID", req.user._id);

      //req.user.languages = req.user.languages[0];
      // console.log(">>", user);
      res.render("user/show", { user: user, currentUser: req.user }); // shows current user information / profile
      // console.log(req.user);
    });
    // .catch(err => {
    //   res.render("error");
    // });
  }
);

module.exports = router;
