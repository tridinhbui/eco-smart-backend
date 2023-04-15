const express = require("express");
const router = express.Router();
// const app = express();
const PORT = process.env.PORT || 8090;
const session = require("express-session");
const crypto = require("crypto");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;
const clientRedis = new Redis();
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

router.get("/get-session", (req, res) => {
  req.session.visitorId = randomVisitorId();
  res.send(req.session);
});

function randomVisitorId() {
  var current_date = new Date().valueOf().toString();
  var random = Math.random().toString();
  var hashNumber = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
  console.log("hashNumber:", hashNumber);
  return hashNumber;
}

module.exports = router;
