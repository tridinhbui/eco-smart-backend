const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");

const User = require("../model/userSchema");

const salt = 10;
// add new user
// check token
router.post("/add-user", auth, async (req, res) => {
  let newUser = req.body;
  const oldUser = await User.findOne({ username: newUser.username });
  // check if the username is exist
  if (oldUser) {
    return res.json({ message: "Username already exist.", statusCode:409 });
  }
  //encrypt password
  newUser.password = await bcrypt.hash(newUser.password, salt);
  await User.create(newUser);
  res.json({ message: "User added successfully!", statusCode: 200 });
});

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  // compare user hash password with input password
  if (user && (await bcrypt.compare(password, user.password))) {
    // create jwt with timetolive
    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
    //const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    // Assigning refresh token in http-only cookie 
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None', secure: false,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ accessToken, username, statusCode:200 });
  } else {
    return res.json({ message: "Unauthorized", statusCode:401 });
  }
});

//refresh access token
router.post("/refresh",async (req, res) => {
  if (req.cookies?.refreshToken) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.refreshToken;
    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          // Wrong Refesh Token
          return res.json({ message: 'Refresh cookie does not match', statusCode:401 });
        }
        else {
          const username = decoded.username;
          // Correct token we send a new access token
          const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});
          //const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET);
          res.json({ accessToken, username, statusCode:200 });
        }
      })
  } else {
    return res.json({ message: 'Refresh cookie does not exist in cookie', statusCode:401 });
  }
});

module.exports = router