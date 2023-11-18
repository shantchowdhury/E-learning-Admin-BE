const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    Name: {type: String, required: true},
    Position: {type: String, required: true},
    Link: {type: String},
    image: {type: String, required: true},
    imageKey:{type:String}
})


module.exports = mongoose.model('team_members', teamSchema);