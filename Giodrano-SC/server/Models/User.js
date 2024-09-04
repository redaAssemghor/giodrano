const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "",
  },
  address: {
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
  number: {
    type: String,
    default: "",
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
});

const User = (module.exports = mongoose.model("User", UserSchema, "user"));
