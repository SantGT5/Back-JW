const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  meetings: [{}],
  date: { type: Date, default: Date.now, trim: true },
  responsible: { type: String, require: true, trim: true },
  meetingID: { type: String, trim: true },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
