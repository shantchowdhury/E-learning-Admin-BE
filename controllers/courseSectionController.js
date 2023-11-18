const CourseSection = require("../models/courseSection");
const courseSectionSubsection = require("../models/courseSectionSubsection");

const {
  checkFileExistenceInS3,
  deleteFileByFileNameFromS3,
} = require("../middleware/s3fileupload.js");

const createCourse = async (req, res) => {
  try {
    const { name, courseId, description, serialId } = req.body;
    const course = new CourseSection({
      name: name,
      description: description,
      serialId: serialId,
      courseId: courseId,
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
    const course = await CourseSection.findById(courseId);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseSection.find({
      courseId: courseId,
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const course = await CourseSection.find();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, courseId, description, serialId } = req.body;
    const id = req.params.id;

    const updatedCourse = await CourseSection.findByIdAndUpdate(
      id,
      {
        name: name,
        description: description,
        courseId: courseId,
        serialId: serialId,
      },
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseSectionId = req.params.id;
    const subSections = await courseSectionSubsection.find({
      courseSectionId: courseSectionId,
    });

    if(subSections.length>0){
      for (let i = 0; i < subSections.length; i++) {
        const video = subSections[i].videoKey;
        const storage = process.env.S3_BUCKET_NAME;
  
        const fileExist = await checkFileExistenceInS3(video, storage);
        if (fileExist) {
          await deleteFileByFileNameFromS3(video, storage);
        }
  
        // const files=subSections[i].file;
  
        // if(files){
        //   for(let i=0;i<files.length;i++){
        //     const fixedBucketName = process.env.S3_FILE_BUCKET_NAME;
        //     const file=files[i];
  
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
      }
    }


    await CourseSection.findByIdAndRemove(courseSectionId);
    res.json({ message: "Course Section deleted successfully" });
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
