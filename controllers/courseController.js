const Course = require("../models/course");
const courseSection = require("../models/courseSection");
const courseSectionSubsection = require("../models/courseSectionSubsection");

const {
  checkFileExistenceInS3,
  uploadImageToS3,
  updateFileByFileNameInS3,
  deleteFileByFileNameFromS3,
} = require("../middleware/s3fileupload.js");

const createCourse = async (req, res) => {
  try {
    const { name, description, category, price, rating } = req.body;
    const storage = process.env.COURSE_IMAGE_BUCKET;
    const file = req.file;
    const result = await uploadImageToS3(file, storage);

    const imageLink = result.link;
    const imageKey = result.key;

    const course = new Course({
      name,
      description,
      price,
      category,
      rating,
      image: imageLink,
      imageKey: imageKey,
    });

    const savedCourse = await course.save();
    res.json(savedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const course = await Course.find();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { name, description, category, price, rating } = req.body;
    const courseId = req.params.id;

    if (req.file) {
      const course = await Course.findById(courseId);

      const storage = process.env.COURSE_IMAGE_BUCKET;
      const newFile = req.file;
      const fileName = course.key;

      const result = await updateFileByFileNameInS3(fileName, newFile, storage);

      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          name,
          description,
          category,
          price,
          rating,
          image: result.link,
          imageKey: result.key,
        },
        { new: true }
      );
      res.json(updatedCourse);
    } else {
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { name, description, category, price, rating },
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
    const courseId = req.params.id;
    const sections = await courseSection.find({
      courseId: courseId,
    });

    if(sections.length>0){
      for (let i = 0; i < sections.length; i++) {
      
        const sectionId = sections[i].id;
        const subsections = await courseSectionSubsection.find({
          courseSectionId: sectionId,
        });
  
        
        for (let i = 0; i < subsections.length; i++) {
          const videoname = subsections[i].videoKey;
          const storage=process.env.S3_BUCKET_NAME;
  
          const fileExist=await checkFileExistenceInS3(videoname,storage);
  
          if(fileExist){
            await deleteFileByFileNameFromS3(videoname,storage);
          }      
  
          // const files = subsections[i].file;
  
          // if (files) {
          //   for (let i = 0; i < files.length; i++) {
          //     const fixedBucketName = process.env.S3_FILE_BUCKET_NAME;
          //     const file = files[i];
  
          //     const params = {
          //       Bucket: fixedBucketName,
          //       Key: file,
          //     };
  
          //     s3.deleteObject(params, (err, data) => {
          //       if (err) {
          //         return res.status(500).send("Error deleting video from S3");
          //       }
          //     });
          //   }
          // }
  
        }
      }
    }

    const course = Course.findById(courseId);
    const courseImageKey = course.key;
    const storage=process.env.COURSE_IMAGE_BUCKET;

    const fileExist=await checkFileExistenceInS3('courseImageKey',storage);

    if(fileExist){
      const deletedImage=await deleteFileByFileNameFromS3(courseImageKey,storage);
    }     

    await Course.findByIdAndRemove(courseId);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log(error,'error');
    res.status(500).json({ error: error.message });
  }
};
const getAllData = async (req, res) => {
  try {
    const courses = await Course.find({});
    const result = [];

    for (const course of courses) {
      const courseId = course._id;
      const courseName = course.name;
      const coursePic = course.image;

      const sections = await courseSection.find({ courseId });
      const secArr = [];

      for (const section of sections) {
        const sectionId = section._id;
        const sectionName = section.name;
        const sectionPic = section.image;

        const subSections = await courseSectionSubsection.find({
          courseSectionId: sectionId,
        });
        const subArr = subSections.map((subsection) => ({
          subSectionId: subsection._id,
          subSectionName: subsection.name,
          subSectionPic: subsection.image,
          subSectionVideo: subsection.video,
          subSectionFiles: subsection.file,
        }));

        secArr.push({
          sectionId,
          sectionName,
          sectionPic,
          subsections: subArr,
        });
      }

      result.push({
        courseId,
        courseName,
        coursePic,
        sections: secArr,
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDataById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const result = {
      courseId: course._id,
      courseName: course.name,
      coursePic: course.image,
      sections: [],
    };

    const sections = await courseSection.find({ courseId });
    for (const section of sections) {
      const sectionId = section._id;
      const sectionName = section.name;
      const sectionPic = section.image;

      const subSections = await courseSectionSubsection.find({
        courseSectionId: sectionId,
      });
      const subArr = subSections.map((subsection) => ({
        subSectionId: subsection._id,
        subSectionName: subsection.name,
        subSectionPic: subsection.image,
        subSectionVideo: subsection.video,
        subSectionFiles: subsection.file,
      }));

      result.sections.push({
        sectionId,
        sectionName,
        sectionPic,
        subsections: subArr,
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCourse,
  getCourse,
  getAll,
  updateCourse,
  deleteCourse,
  getAllData,
  getAllDataById,
};
