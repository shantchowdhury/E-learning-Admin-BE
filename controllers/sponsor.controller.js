const _ = require("lodash");
const Sponsor = require("../models/sponsor.js");

const {
  uploadImageToS3,
  deleteFileByFileNameFromS3
} = require("../middleware/s3fileupload.js");

const imageBucketName = process.env.ESSENTIAL_IMAGE_BUCKET;

const fetchSponsor = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().select("-__v");
    res.send(sponsors);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const addSponsor = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Please upload a photo");

    const ext = req.file.mimetype.split("/")[1];
    if (!["png", "jpg", "jpeg", "webp"].includes(ext))
      return res.status(400).send("Unsupported image format");

    const result = await uploadImageToS3(req.file, imageBucketName);

    const sponsor = new Sponsor({ image: result.link, imageKey: result.key });
    await sponsor.save();
    res.status(201).send(_.omit(JSON.parse(JSON.stringify(sponsor)), ["__v"]));
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const deleteSponsor = async (req, res) => {
  try {
    const { sponsorId } = req.params;

    const sponsor = await Sponsor.findById(sponsorId);
    if (!sponsor) return res.status(404).send("Sponsor not found");

    await deleteFileByFileNameFromS3(sponsor.imageKey, imageBucketName);
    const deletedData = await Sponsor.findByIdAndDelete(sponsorId);
    res.send(deletedData._id);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = { fetchSponsor, addSponsor, deleteSponsor };
