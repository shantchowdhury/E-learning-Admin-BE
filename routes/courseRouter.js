const router = require("express").Router();
const {
  createCourse,
  getCourse,
  getAll,
  updateCourse,
  deleteCourse,
  getAllData,
  getAllDataById,
} = require('../controllers/courseController');
const authorization = require('../middleware/authorization.js');


const multer=require('multer');
const upload=multer();

router.post('/create',upload.single("image"), createCourse);
router.get('/get/:id', getCourse);
router.get('/', getAll);
router.put('/update/:id', authorization,upload.single("image"),updateCourse);
router.delete('/delete/:id',authorization, deleteCourse);

router.get('/get-all-data',getAllData);
router.get('/data/:id',getAllDataById);



module.exports = router;