const router = require("express").Router();
const { PostData, GetAllVideoLinks, GetVideoLinkByVideoname, updateVideoByVideoName,DeleteVideoByVideoname,DeleteAllVideos } = require('../controllers/aws_video_upload_controller');
const multer = require('multer');
const authorization = require('../middleware/authorization.js');

const upload = multer()

router.post('/',authorization, upload.single('video'), PostData);
router.get('/', GetAllVideoLinks);
router.get('/get/:videoname', GetVideoLinkByVideoname);
router.put('/update/:videoname',authorization, upload.single('video'), updateVideoByVideoName);
router.delete('/delete/:videoname',authorization,DeleteVideoByVideoname);
router.delete('/delete-all',authorization,DeleteAllVideos);




module.exports = router;