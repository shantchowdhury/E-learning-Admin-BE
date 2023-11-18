const router = require('express').Router();
const {
    fetchEvents,
    createEvent,
    deleteEvent
} = require('../controllers/event.controller');
const Multer = require('multer');
const upload = Multer({
    storage: Multer.memoryStorage()
})


router.get('/', fetchEvents);
router.post('/createEvent', upload.single('image'), createEvent);
router.delete('/deleteEvent/:eventId', deleteEvent);

module.exports = router;
