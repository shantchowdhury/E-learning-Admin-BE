const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
}, {timestamps:true})


module.exports = mongoose.model('faqs', faqSchema)