const express = require("express");
const router = express.Router();
var cors = require("cors");
const uri = process.env.DB_URI;
const peopleSchema = require("../model/peopleSchema");
const mongoose = require("mongoose");
// var invoiceModel = mongoose.model("invoices", peopleSchema);

router.get("/people", cors(), async function (req, res) {
  await peopleSchema
    .find({})
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err));
});

router.post("/people/add-people", cors(), async function (req, res) {
  var people = new peopleSchema(req.body);
  console.log(req.body);
  await people
    .save()
    .then(() => {
      res.status(200, "people added successfully");
    })
    .catch((err) => console.log(err));
  res.status(200, "people added successfully");
});

module.exports = router;
