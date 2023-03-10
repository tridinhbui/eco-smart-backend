require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const databaseName = "ecosmart-db";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyToken = require("./middleware/auth");

const app = express();
app.use(express.json());
const uri =
  "mongodb+srv://ecosmart:ecosmart@cluster0.bbywemj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
var database;
const saltRounds = 10;

function checkPassword(passwordEnteredByUser, hash) {
  let result = true;
  console.log("passwordEnteredByUser: ", passwordEnteredByUser);
  console.log("hash:", hash);
  bcrypt.compare(passwordEnteredByUser, hash, function (error, isMatch) {
    if (error) {
      throw error;
    } else if (!isMatch) {
      console.log("not match");
      result = false;
    }
  });
  return result;
}

// login
app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let result = await client.connect();
  database = result.db(databaseName);
  collection = database.collection("user");
  let userList = await collection.find({}).toArray();

  // find user from dataabase by username
  const user = userList.find((user) => user.username === username);
  // compare user hash password with input password
  if (checkPassword(password, user.password) === true) {
    console.log("log in");
    // create jwt
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
  } else {
    return res.sendStatus(401);
  }
});

// add new user
app.post("/api/user/add", async (req, res) => {
  let newUser = req.body;
  let result = await client.connect();
  database = result.db(databaseName);
  //encrypt password
  bcrypt.genSalt(saltRounds, function (saltError, salt) {
    if (saltError) {
      return next(saltError);
    } else {
      bcrypt.hash(newUser.password, salt, function (hashError, hash) {
        if (hashError) {
          return next(hashError);
        }
        newUser.password = hash;
        database.collection("user").insertOne(newUser, function (err, res) {
          if (err) throw err;
          db.close();
        });
        console.log(newUser.password);
      });
    }
  });
  res.status(200).send("User added successfully!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
