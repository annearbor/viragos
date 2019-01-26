const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const axios = require("axios");

router.get("/profile", (req, res, next) => {
  res.render("profilepro", { user: req.user }); // shows current user information, can then be edited
  console.log(req.user);
});

router.get("/me/:id", (req, res) => {
  console.log(req.params);
});

// const linkedInApi = axios.create({
//   baseUrl: "https://api.linkedin.com/v1/people/"
// });

// const linkedinprofile =
//   "{linkedinId}:(picture-url,first-name,last-name,summary)?format=json";

// function getLinkedinInfo(linkedinprofile) {
//   linkedInApi
//     .get(theName)
//     .then(responseFromAPI => {
//       console.log("Response from API is: ", responseFromAPI.data);
//     })
//     .catch(err => {
//       console.log("Error is: ", err);
//     });
// }

router.post("/profile", (req, res, next) => {
  const { firstName, lastName, role, summary } = req.body;
  console.log(req.body);
  console.log("THIS IS THE REQ USER", req.user);
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        role: role,
        summary: summary
      }
    }
  ).then(user => {
    console.log("user", user);
    res.redirect("/profile"); // what to do ?
  });
});

module.exports = router;
