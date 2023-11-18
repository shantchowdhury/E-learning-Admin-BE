const mongoose = require("mongoose");
const { Schema } = require('mongoose');
const courseSchema = new mongoose.Schema({
  name: {type: String,unique: true, required: true},
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
},
  description: {type: String},
  rating:{type: String, default:'0'},
  image:{type:String},
  imageKey:{type:String},
  price:{type:Number,required:true}
});


module.exports = mongoose.model('Course', courseSchema);
