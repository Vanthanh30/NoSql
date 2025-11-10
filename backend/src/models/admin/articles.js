const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ArticleSchema = new Schema(
  {
    title: String,
    content: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    status: {
      type: String,
      default: "active",
    },
    image: String,
    createdBy: {
      account_id: String,
      createdAt: { type: Date, default: Date.now },
    },
    updatedBy: {
      account_id: String,
      updatedAt: { type: Date, default: Date.now },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
