const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");

const User = require("../model/userSchema");

const salt= 10;
// add new user
// check token
router.post("/add-user", auth,  async (req, res) => {
  let newUser = req.body;
  const oldUser = await User.findOne({ username: newUser.username });
  // check if the username is exist
  if (oldUser) {
    return res.status(409).json({status:"Username already exist."});
  }
  //encrypt password
  newUser.password = await bcrypt.hash(newUser.password, salt);
  await User.create(newUser);
  res.status(200).json({status: "User added successfully!"});
});

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  // compare user hash password with input password
  if (user && (await bcrypt.compare(password, user.password))) {
    // create jwt with timetolive
    const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: "2h"});
    res.status(200).json({ accessToken, username });
  } else {
    return res.status(401).json({status: "Unauthorized"});
  }
});

module.exports = router