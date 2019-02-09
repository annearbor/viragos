const express = require("express");
const router = express.Router();
//const io = require("socket.io");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/concept", (req, res, next) => {
  res.render("concept");
});

router.get("about", (req, res, next) => {
  res.render("/about-us");
});

router.post("/send-email", (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render("message", { email, subject, message });
});

// Socket.io - online messaging
// router.get("/messaging.hbs", function(req, res) {
//   res.sendFile(__dirname + "/messaging.hbs");
// });

// io.on("connection", function(socket) {
//   console.log("a user connected");
// });

// http.listen(3000, function() {
//   console.log("listening on *:3000");
// });

module.exports = router;
