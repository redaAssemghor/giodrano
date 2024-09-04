const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  payment_id: {
    type: String,
    default: "",
  },
  payment_method: {
    type: String,
    default: "COD",
  },
  order_number: {
    type: String,
    required: true,
  },
  shipping_ref: {
    type: String,
    default: "",
  },
  cart: {
    type: [
      {
        _id: String,
        size: String,
        color: String,
        price: String,
        qnt: Number
      },
    ],
    default: [
      {
        _id: "",
        size: "",
        color: "",
        price: "",
        qnt: 0
      },
    ],
  },
  item_reduction: {
    type: String,
    default: "",
  },
  shipping_fees: {
    type: Number,
    default: 0,
  },
  shipping_address: {
    type: {
      prov: String,
      city: String,
      postal_code: String,
      address: String,
    },
    default: {
      prov: "",
      city: "",
      postal_code: "",
      address: "",
    },
  },
  user_id: {
    type: String,
    default: "",
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "in_progress",
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
});

const Order = (module.exports = mongoose.model("Order", OrderSchema, "order"));
