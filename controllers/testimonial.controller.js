const _ = require("lodash");
const Testimonail = require("../models/testimonial.js");
const { testimonialValidate } = require("../helpers/validation.js");

const {
  uploadImageToS3,
  deleteFileByFileNameFromS3

} = require("../middleware/s3fileupload.js");

const imageBucketName = process.env.TESTIMONIAL_IMAGE_BUCKET;

const fetchTestimonial = async (req, res) => {
  try {
    const testimonials = await Testimonail.find().select("-__v");
    res.send(testimonials);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const createTestimonial = async (req, res) => {
  try {
    // const data = JSON.parse(JSON.stringify(req.body));
    // const { error } = testimonialValidate(_.omit(data, ["id"]));
    // if (error) return res.status(400).send(error.details[0].message);

    // if (!req.file) return res.status(400).send("Please upload a photo");

    // const ext = req.file.mimetype.split("/")[1];
    // if (!["png", "jpg", "jpeg", "webp"].includes(ext))
    //   return res.status(400).send("Unsupported image format");

    const result = await uploadImageToS3(req.file, imageBucketName);
    const testimonial=new Testimonail({
      ...req.body,
      image: result.link,
      imageKey: result.key,
    })

    // const testimonial = new Testimonail({
    //   ..._.omit(data, ["id"]),
    //   image: result.link,
    //   imageKey: result.key,
    // });
    await testimonial.save();
    res.status(200).json({
      'success':true,
      'message':'Testimonial created successfully',
      'testimonial':testimonial
    })
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { testimonialId } = req.params;

    const testimonial = await Testimonail.findById(testimonialId);
    if (!testimonial) return res.status(404).send("Review not found");

    await deleteFileByFileNameFromS3(testimonial.imageKey, imageBucketName);

    await Testimonail.findOneAndDelete(testimonialId);
    res.send("Testimonial deleted");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = { fetchTestimonial, createTestimonial, deleteTestimonial };
