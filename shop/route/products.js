const express = require("express");
const router = express.Router();
const Product = require("../model/productSchema");
var cors = require("cors");
const uri = process.env.DB_URI;

router.get("/products", cors(), async function (req, res) {
  await Product.find({})
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err));
});

router.get("/products/:id", cors(), function (req, res) {
  var query = req.params.id;

  Product.find({
    _id: query,
  })
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err));
});

module.exports = router;
