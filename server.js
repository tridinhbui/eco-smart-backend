require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const databaseName = "ecosmart-db";
const jwt = require("jsonwebtoken");
const userList = require("./user.js");
const verifyToken = require("./middleware/auth");
const app = express();
app.use(express.json());
const uri =
  "mongodb+srv://ecosmart:ecosmart@cluster0.bbywemj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

var database;

// async function getData() {
//   let result = await client.connect();
//   database = result.db(databaseName);
//   collection = database.collection("user");
//   let data = await collection.find({}).toArray();
// }

// getData();

app.get("/posts", verifyToken, (req, res) => {
  res.json({ post: "my post" });
});

// login
app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let result = await client.connect();
  database = result.db(databaseName);
  collection = database.collection("user");
  let userList = await collection.find({}).toArray();
  const user = userList.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) return res.sendStatus(401);

  // create jwt
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

// add new user
app.post("/api/user/add", async (req, res) => {
  let newUser = req.body;
  let result = await client.connect();
  database = result.db(databaseName);
  database.collection("user").insertOne(newUser, function (err, res) {
    if (err) throw err;
    db.close();
  });
  res.status(200).send("User added successfully!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
