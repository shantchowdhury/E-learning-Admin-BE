const router = require("express").Router();
const {
  createCourse,
  getCourse,
  getCourseById,
  getAll,
  updateCourse,
  deleteCourse
} = require('../controllers/courseSectionSubsectionController');
const authorization = require('../middleware/authorization.js');

router.post('/create', authorization, createCourse);
router.get('/get/:id', getCourse);
router.get('/get-course-section/:id', getCourseById);
router.get('/', getAll);
router.put('/update/:id', authorization, updateCourse);
router.delete('/delete/:id', authorization, deleteCourse);

module.exports = router;