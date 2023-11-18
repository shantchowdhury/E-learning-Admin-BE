const router = require('express').Router();
const {
    fetchTestimonial, 
    createTestimonial, 
    deleteTestimonial
} = require('../controllers/testimonial.controller.js');
const Multer = require('multer');
const upload = Multer({
    storage: Multer.memoryStorage()
})


router.get('/', fetchTestimonial);
router.post('/createTestimonial', upload.single('image'), createTestimonial);
router.delete('/deleteTestimonial/:testimonialId', deleteTestimonial);

module.exports = router;