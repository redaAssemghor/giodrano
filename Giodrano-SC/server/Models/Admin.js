const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "",
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
});

const Admin = (module.exports = mongoose.model("Admin", AdminSchema, "admin"));
