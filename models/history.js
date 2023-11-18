const mongoose = require('mongoose');
const historySchema = new mongoose.Schema({
    Subject: {type: String, required: true},
    Message: {type: String, required: true},
    time: {type: String, required: true}
})


module.exports = mongoose.model('contact_histories', historySchema)