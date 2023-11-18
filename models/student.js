const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({}, {strict: false});

module.exports = mongoose.model('students', studentSchema);