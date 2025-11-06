const mongoose = require('mongoose');
const { Schema } = mongoose;

const LessonSchema = new Schema({
    title: String,
    videoUrl: String,
    videoDuration: Number, // in seconds
    attachmentUrl: String,
    preview: { type: Boolean, default: false }, // cho phép học thử
}, {
    timestamps: true
});

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
