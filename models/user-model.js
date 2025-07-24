const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String },
  lang: { type: String, default: "es" },
  theme: { type: String, default: "light" },
  googleTokens: {
    access_token: String,
    refresh_token: String,
    scope: String,
    token_type: String,
    expiry_date: Number
  }
});

module.exports = mongoose.model('User', userSchema);
