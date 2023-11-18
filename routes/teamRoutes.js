const router = require('express').Router();
const {
    fetchMembers,
    addMember,
    deleteMember
} = require('../controllers/team.controller.js');
const Multer = require('multer');
const upload = Multer({
    storage: Multer.memoryStorage()
})

router.get('/', fetchMembers);
router.post('/addMember', upload.single('image'), addMember);
router.delete('/deleteMember/:memberId', deleteMember);

module.exports = router;