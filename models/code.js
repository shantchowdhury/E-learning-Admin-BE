const mongoose = require('mongoose');

// Mongoose schema for store the login code
const codeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin_users',
        required: true
    },
    login_code: {
        type: String,
        required: true
    },
    expire: {
        type: Number, 
        required: true
    }
})

module.exports = mongoose.model('admin_login_codes', codeSchema);