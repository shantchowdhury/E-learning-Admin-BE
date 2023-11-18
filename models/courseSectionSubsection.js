const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const courseSectionSubsectionSchema = new mongoose.Schema({
  name: {type: String},
  serialId:{type :Number},
  courseSectionId:  {
    type: Schema.Types.ObjectId,
    ref: 'courseSection',
    required: true,
},
  description: {type: String},
  video:{type: String},
  videoKey:{type:String},
  image:{type:String},
  imageKey:{type:String},
  file:{type:Array,default:[]},
  IsSeen:{type:Boolean, default:false},
  rating:{type: String, default:'0'},
});


module.exports = mongoose.model('courseSectionSubsection', courseSectionSubsectionSchema);