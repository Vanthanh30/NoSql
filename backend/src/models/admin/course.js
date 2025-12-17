const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    title: String,
    category: String,
    level: String,
    language: String,
    instructor: String,
    status: { type: String, default: "active" },

    time: {
      startDate: Date,
      endDate: Date,
      durationHours: Number,
    },
    media: {
      imageUrl: String,
      videoUrl: String,
    },
    pricing: {
      price: Number,
      discount: Number,
      finalPrice: Number,
    },

    description: String,

    chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],

    createdBy: {
      account_id: { type: Schema.Types.ObjectId, ref: "adminAccount" },
      createdAt: { type: Date, default: Date.now },
    },
    updatedBy: {
      account_id: { type: Schema.Types.ObjectId, ref: "adminAccount" },
      updatedAt: { type: Date, default: Date.now },
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
