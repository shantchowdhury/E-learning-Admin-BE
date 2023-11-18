const config = require('config');
const mongoose = require('mongoose');
const CONN_STRING = config.get('string');
mongoose.set('strictQuery', false);

module.exports = function() {
    mongoose.connect(CONN_STRING, function(error, db){
        if(error){
            console.log('Database connection error: ' + error.message);
        }else{
            console.log('Database connected');
        }
    })
} 