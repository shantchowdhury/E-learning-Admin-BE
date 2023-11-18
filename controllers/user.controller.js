const _ = require("lodash");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const Student = require("../models/student.js");
const Course=require("../models/course.js");
const {
  userValidate,
  emailValidate,
  passwordValidate,
} = require("../helpers/validation.js");
const {
  uploadImageToS3,
  deleteFileByFileNameFromS3,
} = require("../middleware/s3fileupload.js");
const course = require("../models/course.js");

const imageBucketName = process.env.ADMIN_IMAGE_BUCKET;

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find().select("-Password -__v");
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal server error" + error.message);
  }
};

const createUser = async (req, res) => {
  try {
    console.log(req.file);
    const data = JSON.parse(JSON.stringify(req.body));
    const { error } = userValidate(_.pick(data, ["Name", "Email", "Password"]));
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    const checkEmail = await User.findOne({ Email: data.Email });
    if (checkEmail) return res.status(400).send("Email is already in use");

    const checkPhone = await User.findOne({ Phone: data.Phone });
    if (checkPhone) return res.status(400).send("Phone is already in use");
    if (!req.file) return res.status(400).send("Please upload a photo");

    const file = await uploadImageToS3(req.file, imageBucketName);

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.Password, 12);
    data.Password = hashedPassword;

    const user = new User({
      ..._.omit(data, ["id"]),
      image: file.link,
      imageKey: file.key,
    });
    await user.save();
    res
      .status(201)
      .send(_.omit(JSON.parse(JSON.stringify(user)), ["Password", "__v"]));
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const updateUser = async (req, res) => {
  try {
    const { Email, Role, Password } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(400).send("User not found");

    if (Email === user.Email && Role === user.Role && !Password)
      return res.status(400).send("Change the student details");

    let updatedData = {};

    if (Email !== user.Email) {
      const { error } = emailValidate({ Email });
      if (error) return res.status(400).send(error.details[0].message);

      const checkEmail = await User.findOne({ Email });
      if (checkEmail) return res.status(400).send("Email is already in use");
      updatedData = await User.findByIdAndUpdate(
        userId,
        { Email },
        { new: true }
      ).select("-__v");
    }

    if (Role !== user.Role) {
      updatedData = await User.findByIdAndUpdate(
        userId,
        { Role },
        { new: true }
      ).select("-__v");
    }

    if (Password) {
      const { error } = passwordValidate({ Password });
      if (error) return res.status(400).send(error.details[0].message);
      const hashedPassword = await bcrypt.hash(Password, 12);
      updatedData = await User.findByIdAndUpdate(
        userId,
        { Password: hashedPassword },
        { new: true }
      ).select("-__v");
    }

    res.send(updatedData);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body; // From middleware
    const { userId } = req.params;
    if (userId === id) return res.status(400).send("You can't delete yourself");
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    await deleteFileByFileNameFromS3(user.imageKey, imageBucketName);
    const deletedData = await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const courseEnrolled = async (req, res) => {
  try {
    const studentId = req.params.id;
    const courseId = req.body.courseId;

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId, courses: { $ne: courseId } },
      { $addToSet: { courses: courseId } },
      { new: true}
    );

    if (!updatedStudent) {
      return res.status(400).send('Course already enrolled');
    }

    console.log(updatedStudent); // Log the updated student details

    res.status(200).send('Course enrolled successfully');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal server error');
  }
};
const courseUnenrolled = async (req, res) => {
  try {
    const studentId = req.params.id;
    const courseId = req.body.courseId;
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId, courses: courseId },
      { $pull: { courses: courseId } },
      { new: true}
    );
    if (!updatedStudent) {
      return res.status(400).send('Course not enrolled');
    }
    console.log(updatedStudent); // Log the updated student details
    res.status(200).send('Course unenrolled successfully');
  } catch (e) { 
    console.log(e);
    res.status(500).send('Internal server error');
  }
}

const enrollData = async (req, res) => {
  // get student details and populate courses array
  const studentId = req.params.id;
  console.log(studentId)
  let student = await Student.findById(studentId)
  if(student?.courses?.length!=0){
    const courses = await Course.find({ _id: { $in: student.courses } }, '_id name');
    student = student.toObject();
    student.courses = courses;
  }
  // .populate('courses',strictPopulate = false);
  res.send(student);
}


module.exports = {
  createUser,
  updateUser,
  deleteUser,
  fetchUsers,
  courseEnrolled,
  enrollData,
  courseUnenrolled
};
