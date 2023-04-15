require("dotenv").config();
var cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./route/user");
const productsRouter = require("./shop/route/products");
const invoicesRouter = require("./shop/route/invoices");
const peopleRouter = require("./shop/route/people");
const sessionRouter = require("./shop/session");
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require("crypto");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;
const clientRedis = new Redis();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ extended: false }));

session;
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
  "mongodb+srv://ecosmartvietnam:ecosmartvietnam@cluster0.pyvfb93.mongodb.net/ecoshopvietnam-db";

mongoose
  .connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connect Mongodb successfully"))
  .catch((err) => console.log("Error MongoDB: ", err));

app.use("/api", userRouter);
app.use("/api", sessionRouter);
app.use("/api", productsRouter);
app.use("/api", invoicesRouter);
app.use("/api", peopleRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
