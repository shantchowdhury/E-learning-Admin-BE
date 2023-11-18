const config = require('config');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');

// Creating email transporter 
const transporter = nodemailer.createTransport(smtpTransport({
    service: config.get('mail.service'),
    host: config.get('mail.smtp'),
    port: 465,
    secure: true,
    auth: {
        user: config.get('mail.email'),
        pass: config.get('mail.password') ,
    },
})) 
 

transporter.verify(function(err, success){
    if(success) console.log('Mail server connected')
    else console.log(err.message)
})

module.exports = transporter;