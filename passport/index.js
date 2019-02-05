const passport = require("passport");

require("./serializers");
require("./strategies");

//Enable authenication with session & passport
module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};

//passport.session acts as a middleware to alter the req object and change the 'user' value that
// is currently the session id (from the client cookie) into the true deserialized user object.
//persistent login sessions
