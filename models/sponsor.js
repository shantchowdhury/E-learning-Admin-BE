const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    image: {
        type: String, 
        required: true
    },
    imageKey:{type:String}
})

module.exports = mongoose.model('sponsors', sponsorSchema);