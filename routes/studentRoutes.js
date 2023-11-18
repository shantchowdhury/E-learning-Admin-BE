const router = require('express').Router();
const {
    fetchStudents, 
    blockStudent,
    unblockStudent,
    updateStudent
} = require('../controllers/student.controller.js');

router.get('/', fetchStudents);
router.put('/updateStudent/:studentId', updateStudent); 
router.put('/block/:studentId', blockStudent); 
router.put('/unblock/:studentId', unblockStudent); 

module.exports = router;