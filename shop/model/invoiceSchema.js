const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const invoiceSchema = new Schema({
  name: String,
  email: String,
  address: String,
  phoneNumber: String,
  note: String,
  totalPrice: Number,
  paymentMethod: String,
  productList: [Object],
  deliveryTime: String,
  deliveryStatus: String,
  orderStatus: String,
  paymentStatus: String,
});

module.exports = model("invoices", invoiceSchema);
