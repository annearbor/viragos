const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

//shows profiles that the current user liked
router.get("/profiles/likes", ensureLoggedIn(), (req, res, next) => {
  User.find()
    .then(results => {
      for (let i = 0; i < results.length; i++) {
        results[i].liked = req.user.likes.includes(results[i]._id);
      }
      res.render("user/users", { results, user: req.user });
    })
    .catch(error => {
      console.log(error);
    });
});

// router.post("/profiles/likes", (req, res, next) => {
//   //id of the current user
//   const id = req.param("id");
//   // if already includes in the array of the other user then remove else add

//   // const result = words.filter(word => word.length > 6);
//   req.user.likes.

//   const result = req.user.likes
//    if (req.user.likes.includes(id)) {

//    }

//       req.user.likes.push(id)
//   }
//   req.user.update();
//   // then
//   User.find()
//     .then(results => {
//       for (let i = 0; i < results.length; i++) {
//         results[i].liked = req.user.likes.includes(results[i]._id);
//       }
//       res.render("user/users", { results, user: req.user });
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });

// search and find users by location with their currentPosition
router.post("/results", ensureLoggedIn(), (req, res) => {
  const location = req.body.search;
  console.log(location);

  if (location) {
    query = { currentPosition: location };
  } else {
    query = {};
  }
  console.log("query", query);

  User.find(query)
    .then(results => {
      res.render("search/results", { results });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

// store all currentPosition in MONGO lowercase
// Ex: berlin, montreal,

//currentIndustry: String,
//role: { type: String, enum: ["Mentor", "Mentee"] },
