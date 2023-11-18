const router = require('express').Router();
const {
    fetchMessages,
    replyMessage,
    deleteMessage
} = require('../controllers/contact.controller.js');

router.get('/', fetchMessages);
router.put('/replyMessage/:messageId', replyMessage);
router.delete('/deleteMessage/:messageId', deleteMessage);

module.exports = router;