const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    Name: {type: String, required: true},
    Slug: {type: String, required: true}
})

module.exports = mongoose.model('categories', categorySchema);