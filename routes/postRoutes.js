const router = require('express').Router();
const {
    fetchPosts,
    createPost,
    makeDraft, 
    makePublish,
    deletePost
} = require('../controllers/post.controller.js');
const Multer = require('multer');
const upload = Multer({
    storage: Multer.memoryStorage()
})
 

router.get('/', fetchPosts);
router.post('/createPost', upload.single('image'), createPost);
router.put('/makeDraft/:postId', makeDraft);
router.put('/makePublish/:postId', makePublish);
router.delete('/deletePost/:postId', deletePost); 

module.exports = router;
