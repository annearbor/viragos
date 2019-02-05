const passport = require("passport");
const User = require("../models/user");

passport.serializeUser(function(user, callback) {
  callback(null, user);
});
passport.deserializeUser(function(user, callback) {
  callback(null, user);
});

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//   User.findByEmail(user, (err, userDocument) => {
//     if (err) {
//       cb(err);
//       return;
//     }

//     cb(null, userDocument);
//   });
// });
