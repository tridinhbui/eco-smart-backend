const {Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: { type: String, unique: [true, "username already exists"] },
    password: {type: String}
})

module.exports = model("users", userSchema);