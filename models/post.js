const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema ({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Slug: {type: String, required: true},
    meta_description: { type: String, required: true },
    image: { type: String, required: true },
    imageKey:{ type: String},
    category: { type: mongoose.Schema.Types.ObjectId, ref: "categories", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "admin_users", required: true },
    date: { type: String, required: true }, 
    published: { type: Boolean, default: true}
});

module.exports = mongoose.model('posts', PostSchema);
