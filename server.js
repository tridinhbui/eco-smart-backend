require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./route/user");
const sessionRouter = require("./route/session");
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require("crypto");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;
const clientRedis = new Redis();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

//session
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    store: new RedisStore({ client: clientRedis }),
    resave: false,
    haveUnitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 10 * 60 * 1000 },
  })
);

const databaseUrl =
  "mongodb+srv://ecosmartvietnam:eco12345678@cluster0.pyvfb93.mongodb.net/eco-smart-vietnam?retryWrites=true&w=majority";

mongoose
  .connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connect Mongodb successfully"))
  .catch((err) => console.log("Error MongoDB: ", err));

app.use("/api", userRouter);
app.use("/api", sessionRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
