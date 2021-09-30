const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  meetings: [
    {
      name: { type: String, require: true, trim: true },
      timer: { type: Number, require: true, trim: true },
    },
  ],
  date: { type: Date, default: Date.now, trim: true },
  responsible: { type: String, require: true, trim: true },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
