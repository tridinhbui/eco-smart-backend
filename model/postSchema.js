const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  content: { type: String },
  title: { type: String },
  type: {type:String},
  view: {type: Number},
  privacy: { type: String },
  imageURL: { type: String },
  link: { type: String },
  createdAt: {type: Date, default: Date.now},
  modifiedAt: {type: Date, default: Date.now}
})

module.exports = model("posts", postSchema);