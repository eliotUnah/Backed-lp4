// models/Category.js
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: false,
  }
});

CategorySchema.index({ name: 1, userId: 1 }, { unique: true });
CategorySchema.plugin(uniqueValidator);


module.exports = mongoose.model("Category", CategorySchema); 