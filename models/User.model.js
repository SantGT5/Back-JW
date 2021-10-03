const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "RESPONSABLE", "PRESIDENTE", "CONVIDADO"],
    required: true,
    default: "CONVIDADO",
  },
});

module.exports = mongoose.model("User", UserSchema);
