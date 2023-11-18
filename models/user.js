const mongoose = require('mongoose');

//This schema is for admin dashboard user not nonacademy registered user(students)
const userSchema = new mongoose.Schema({
    Name: {type: String, required: true},
    Email: {type: String, unique: true, required: true},
    Phone: {type: String, unique: true, require: true},
    Role: {type: Number},
    Password: {type: String, require: true},
    image: {type: String},
    imageKey:{type:String},
    joined: {type: String},
},{timestamps:true});
  
  
module.exports = mongoose.model('admin_users', userSchema);