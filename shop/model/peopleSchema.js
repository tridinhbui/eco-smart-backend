const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const peopleSchema = new Schema({
  username: String,
  password: String,
});

module.exports = model("people", peopleSchema);
