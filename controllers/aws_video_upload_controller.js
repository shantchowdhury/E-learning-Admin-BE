const {
  uploadImageToS3,
  getAllFileLinksFromS3,
  getFileLinkByFileNameFromS3,
  updateFileByFileNameInS3,
  deleteFileByFileNameFromS3,
  deleteAllFilesFromS3,
} = require("../middleware/s3fileupload.js");


exports.PostData = async (req, res) => {
  try {
    const file = req.file;
    storage = process.env.S3_BUCKET_NAME;

    const result = await uploadImageToS3(file, storage);

    res.send({
      message: "Video uploaded successfully",
      location: result.link,
      key: result.key,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.GetAllVideoLinks = async (req, res) => {
  try {
    const storage = process.env.S3_BUCKET_NAME;

    const result = await getAllFileLinksFromS3(storage);

    return res.status(200).json({
      message: `All videos from ${storage}`,
      result: result,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.GetVideoLinkByVideoname = async (req, res) => {
  try {
    const videoname = req.params.videoname;
    const storage = process.env.S3_BUCKET_NAME;

    const result = await getFileLinkByFileNameFromS3(videoname, storage);
    return res.status(200).json({
      message: `${videoname} from ${storage}`,
      result: result,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.updateVideoByVideoName = async (req, res) => {
  try {
    const videoName = req.params.videoname;
    const newVideoFile = req.file;
    const storage = process.env.S3_BUCKET_NAME;

    const result = await updateFileByFileNameInS3(
      videoName,
      newVideoFile,
      storage
    );
    return res.status(200).json({
      message: `${videoName} to ${result.link} from ${storage}`,
      result: result.link,
      key: result.key,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.DeleteVideoByVideoname = async (req, res) => {
  try {
    const videoname = req.params.videoname;
    const storage = process.env.S3_BUCKET_NAME;

    const result = await deleteFileByFileNameFromS3(videoname, storage);
    return res.status(200).json({
      message: `${videoname} deleted successfully from ${storage}`,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.DeleteAllVideos = async (req, res) => {
  try {
    const storage = process.env.S3_BUCKET_NAME;
    const result = await deleteAllFilesFromS3(storage);

    return res.status(200).json({
      message: `${storage} Deleted successfully`,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
