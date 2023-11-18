const router = require('express').Router();
const {
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategroy
} = require("../controllers/category.controller.js");

router.get('/', fetchCategory);
router.post('/createCategory', createCategory);
router.put('/updateCategory/:categoryId', updateCategory);
router.delete('/deleteCategory/:categoryId', deleteCategroy);

module.exports = router;