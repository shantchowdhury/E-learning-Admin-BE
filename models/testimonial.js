const mongoose = require('mongoose');

//This schema is for admin dashboard user not nonacademy registered user(students)
const testimonialSchema = new mongoose.Schema({
    Name: {type: String, required: true},
    Title: {type: String, required: true},
    Review: {type: String, required: true},
    image: {type: String},
    imageKey:{type:String}
});
  
  
module.exports = mongoose.model('testimonials', testimonialSchema);