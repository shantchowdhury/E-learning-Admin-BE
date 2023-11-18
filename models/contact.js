const mongoose = require('mongoose');
const conatctSchema = new mongoose.Schema({
    history: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contact_histories'
    }
}, {strict: false});

module.exports = mongoose.model('contact_entries', conatctSchema);