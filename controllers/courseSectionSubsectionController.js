const courseSectionSubsection = require("../models/courseSectionSubsection");
const CourseSectionSubsection = require("../models/courseSectionSubsection");

const {
  checkFileExistenceInS3,
  deleteFileByFileNameFromS3,
} = require("../middleware/s3fileupload.js");

const createCourse = async (req, res) => {
  try {
    console.log(req.file);
    const {
      name,
      serialId,
      courseSectionId,
      description,
      video,
      videoKey,
      file,
    } = req.body;

    const course = new CourseSectionSubsection({
      name: name,
      courseSectionId: courseSectionId,
      description: description,
      video: video,
      videoKey: videoKey,
      serialId: serialId,
      file: file,
    });
    const savedCourse = await course.save();
    res.json(savedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseSectionSubsection.findById(courseId);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const courseSectionId = req.params.id;
    const course = await CourseSectionSubsection.find({
      courseSectionId: courseSectionId,
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const course = await CourseSectionSubsection.find();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, serialId, courseSectionId, description, video, file } =
      req.body;
    // let path = process.env.client_url + "/public/" + req.filename;
    const courseId = req.params.id;
    if (req.file) {
      const updatedCourse = await CourseSectionSubsection.findByIdAndUpdate(
        courseId,
        {
          name: name,
          serialId: serialId,
          courseSectionId: courseSectionId,
          description: description,
          video: video,
          videoKey: videoKey,
          file: file,
        },
        { new: true }
      );
      res.json(updatedCourse);
    } else {
      const updatedCourse = await CourseSectionSubsection.findByIdAndUpdate(
        courseId,
        req.body,
        { new: true }
      );
      res.json(updatedCourse);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseSectionSubsectionId = req.params.id;
    const subsection = await courseSectionSubsection.findById(
      courseSectionSubsectionId
    );

    const video = subsection.videoKey;
    const storage = process.env.S3_BUCKET_NAME;

    const fileExist = await checkFileExistenceInS3(video, storage);
    if (fileExist) {
      await deleteFileByFileNameFromS3(video, storage);
    }
    // const files = subsection.file;
    // if (files) {
    //   for (let i = 0; i < files.length; i++) {
    //     const storageFile = process.env.S3_FILE_BUCKET_NAME;
    //     const file = files[i];

    //     const params = {
    //       Bucket: fixedBucketName,
    //       Key: file
    //     };

    //     s3.deleteObject(params, (err, data) => {
    //       if (err) {
    //         return res.status(500).send('Error deleting video from S3');
    //       }
    //     });

    //   }
    // }

    await CourseSectionSubsection.findByIdAndRemove(courseSectionSubsectionId);
    res.json({ message: "Subsection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourse,
  getCourseById,
  getAll,
  updateCourse,
  deleteCourse,
};
