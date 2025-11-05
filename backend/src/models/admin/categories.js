const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const CategorySchema = new Schema({
    title: String,
    description: String,
    parentId: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: 'active'
    },
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
