const ejs = require('ejs');
const path = require('path');
const transporter = require('./transporter.js');

// Collecting the student information where the mail function is called 
async function sendReply({Name, Email, Subject, Message, time}){
    const templatePath = path.join(__dirname, '../views/reply.ejs');

    try{  
        const data = await ejs.renderFile(templatePath, {Name, Message, time}); 
        await transporter.sendMail({
            from: 'NonAcademy Customer Care <nonacademy1@gmail.com>', 
            to: Email,
            subject: Subject,
            html: data
        })
    }catch(err){
        console.log('Mail not sent');
    }
}


async function sendLoginCode({Name, Email, Code}){
    const templatePath = path.join(__dirname, '../views/code.ejs');

    try{  
        const data = await ejs.renderFile(templatePath, {Name, Code}); 
       await transporter.sendMail({
            from: 'NonAcademy <nonacademy1@gmail.com>', 
            to: Email,
            subject: 'Login Code from NonAacademy',
            html: data
        })
    }catch(err){
        console.log('Mail not sent');
    }
} 
 
module.exports = {sendReply, sendLoginCode};