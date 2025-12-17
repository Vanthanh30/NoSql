const mongoose = require("mongoose");
const { Schema } = mongoose;

const LessonSchema = new Schema(
  {
    title: String,
    videoUrl: String,
    videoDuration: Number,
    attachmentUrl: String,
    preview: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
