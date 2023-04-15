const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  type: String,
  images: [String],
});

module.exports = model("products", productSchema);
