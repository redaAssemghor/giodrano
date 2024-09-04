const mongoose = require("mongoose");

const SettingsSchema = mongoose.Schema({
  cover: {
    type: String,
    required: true,
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
});

const Settings = (module.exports = mongoose.model(
  "Settings",
  SettingsSchema,
  "settings"
));
