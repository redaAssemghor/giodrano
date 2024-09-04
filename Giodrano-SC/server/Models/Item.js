const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  item_ref: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "men",
  },
  superset: {
    type: String,
    required: true,
  },
  subset: {
    type: String,
    default: "",
  },
  entitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  imgs: {
    type: Array,
    required: true,
  },
  new_arrival: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: [
      {
        color: String,
        sizes: [
          {
            size: String,
            qnt: Number,
          },
        ],
      },
    ],
    required: true,
  },
  all_time_purchase: {
    type: Number,
    default: 0,
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
});

const Item = (module.exports = mongoose.model("Item", ItemSchema, "item"));
