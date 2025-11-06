const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChapterSchema = new Schema({
    title: String,
    lessons: [
        { type: Schema.Types.ObjectId, ref: 'Lesson' }
    ]
}, {
    timestamps: true
});

const Chapter = mongoose.model('Chapter', ChapterSchema);

module.exports = Chapter;
