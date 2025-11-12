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
      account_id: { type: Schema.Types.ObjectId, ref: "adminAccount" },
      createdAt: { type: Date, default: Date.now }
    },
    updatedBy: {
      account_id: { type: Schema.Types.ObjectId, ref: "adminAccount" },
      updatedAt: { type: Date }
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date

  }, { timestamps: true }
);

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
