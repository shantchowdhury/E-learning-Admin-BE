const _ = require('lodash');
const Contact = require('../models/contact.js');
const History = require('../models/history.js');
const {sendReply} = require('../mail/mail.js');

const fetchMessages = async (req, res) => {
    try {
        const messages = await Contact.find().select("-__v").populate({path: 'history', select: '-_id -__v'});
        res.send(messages);   
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const replyMessage = async (req, res) => {
    try {
        const {messageId} = req.params;
        const {Subject, Message, time} = req.body;

        const message = await Contact.findById(messageId);
        if(!message) return res.status(404).send('Message not found');

        if(message.status === 1) return res.status(200).send("Issue is already solved");

        const history = new History(req.body);
        await history.save();
        const updatedData = await Contact.findByIdAndUpdate(messageId, {history: history._id, status: 1}, {new: true});

        sendReply({Name: message.Name, Email: message.Email, Subject, Message, time}); 

        const removeVersion = _.omit(JSON.parse(JSON.stringify(history)), ['__v'])
        res.send({history: removeVersion, inboxId: updatedData._id});
    } catch (error) {
        res.status(500).send('Interval server error');
    }
}

const deleteMessage = async (req, res) => {
    try {
        const {messageId} = req.params;
        const message = await Contact.findById(messageId);
        if(!message) return res.status(400).send('Message not found');

        let updatedData = {};
        if(message?.history){
           updatedData = await History.findByIdAndDelete(message.history);
        }

        updatedData = await Contact.findByIdAndDelete(messageId);
        res.send(updatedData._id);
    } catch (error) {
        res.status(500).send('Interval server error');
    }
}

module.exports = {fetchMessages, replyMessage, deleteMessage};