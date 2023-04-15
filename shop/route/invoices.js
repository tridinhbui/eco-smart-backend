const express = require("express");
const router = express.Router();
var cors = require("cors");
const uri = process.env.DB_URI;
const invoiceSchema = require("../model/invoiceSchema");
const mongoose = require("mongoose");
// var invoiceModel = mongoose.model("invoices", invoiceSchema);

router.get("/invoices", cors(), async function (req, res) {
  await invoiceSchema
    .find({})
    .then((doc) => res.json(doc))
    .catch((err) => console.log(err));
});

router.post("/invoices/add-invoice", cors(), async function (req, res) {
  var invoiceDetails = new invoiceSchema(req.body);
  await invoiceDetails
    .save()
    .then(() => {
      res.json("invoice added successfully");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
