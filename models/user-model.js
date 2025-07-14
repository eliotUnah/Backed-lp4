const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },// UID del usuario del firebase, todavia no se agg un ID para idenficarlo.
  email: { type: String }, //Correo del usuario
  lang: { type: String, default: "es" }, //idioma
  theme: { type: String, default: "light" }, //tema
});

module.exports = mongoose.model('User', userSchema);