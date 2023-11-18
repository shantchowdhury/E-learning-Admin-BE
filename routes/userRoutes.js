const router = require('express').Router();
const {
    fetchUsers, 
    createUser, 
    updateUser, 
    deleteUser,
    courseEnrolled,
    enrollData,
    courseUnenrolled
} = require('../controllers/user.controller.js');
const Multer = require('multer');
const upload = Multer({
    storage: Multer.memoryStorage()
})


router.get('/', fetchUsers);
router.post('/createUser', upload.single('image'), createUser);
router.put('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', deleteUser);
router.post('/student/course-enroll/:id',courseEnrolled);
router.post('/student/course-enroll-remove/:id',courseUnenrolled);
router.get('/student/enroll-data/:id',enrollData);

module.exports = router;