require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRouter= require("./route/user");
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json()); 

const databaseUrl = "mongodb+srv://ecosmartvietnam:eco12345678@cluster0.pyvfb93.mongodb.net/eco-smart-vietnam?retryWrites=true&w=majority"

mongoose.connect(databaseUrl, { useNewUrlParser : true,useUnifiedTopology: true })
  .then(() => console.log('Connect Mongodb successfully'))
  .catch((err) => console.log('Error MongoDB: ', err));;

app.use("/user", userRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ...${PORT}`);
});
