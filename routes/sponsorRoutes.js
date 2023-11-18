const router = require('express').Router();
const {
    fetchSponsor,
    addSponsor,
    deleteSponsor
} = require('../controllers/sponsor.controller.js');
const Multer = require('multer');
const upload = Multer({
    storage: Multer.memoryStorage()
})

router.get('/', fetchSponsor);
router.post('/addSponsor', upload.single('image'), addSponsor);
router.delete('/deleteSponsor/:sponsorId', deleteSponsor);

module.exports = router;