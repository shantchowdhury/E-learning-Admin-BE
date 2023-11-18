const _ = require("lodash");
const Team = require("../models/team.js");
const { teamValidate } = require("../helpers/validation.js");

const {
  uploadImageToS3,
  deleteFileByFileNameFromS3,
} = require("../middleware/s3fileupload.js");

const imageBucketName = process.env.ESSENTIAL_IMAGE_BUCKET;

const fetchMembers = async (req, res) => {
  try {
    const members = await Team.find().select("-__v");
    res.send(members);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const addMember = async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const { error } = teamValidate(_.omit(data, ["id"]));
    if (error) return res.status(400).send(error.details[0].message);

    if (!req.file) return res.status(400).send("Please upload a photo");

    const ext = req.file.mimetype.split("/")[1];
    if (!["png", "jpg", "jpeg", "webp"].includes(ext))
      return res.status(400).send("Unsupported image format");

    const result = await uploadImageToS3(req.file, imageBucketName);
    const member = new Team({
      ..._.omit(data, ["id"]),
      image: result.link,
      imageKey: result.key,
    });
    await member.save();
    res.status(201).send(_.omit(JSON.parse(JSON.stringify(member)), ["__v"]));
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await Team.findById(memberId);
    if (!member) return res.status(404).send("Member not found");
    await deleteFileByFileNameFromS3(member.imageKey, imageBucketName);

    const deletedData = await Team.findByIdAndDelete(memberId);
    res.send(deletedData._id);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = { fetchMembers, addMember, deleteMember };
