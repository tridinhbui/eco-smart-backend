require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userList = require("./user.js");
const verifyToken = require("./middleware/auth");
const app = express();
app.use(express.json());
const url =
  "mongodb+srv://ecosmart:ecosmart@cluster0.bbywemj.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(url);

    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}

app.get("/posts", verifyToken, (req, res) => {
  res.json({ post: "my post" });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = userList.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) return res.sendStatus(401);

  // create jwt
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

connect();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
