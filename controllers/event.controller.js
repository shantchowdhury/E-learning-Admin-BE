const _ = require("lodash");
const Event = require("../models/event.js");
const { eventValidate } = require("../helpers/validation.js");


const {
  uploadImageToS3,
  deleteFileByFileNameFromS3,
} = require("../middleware/s3fileupload.js");


const imageBucketName = process.env.EVENT_IMAGE_BUCKET;

const fetchEvents = async (req, res) => {
  try {
    const events = await Event.find().select("-__v");
    res.send(events);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const createEvent = async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data)
    // const { error } = eventValidate(
    //   _.pick(data, [
    //     "Title",
    //     "Short description",
    //     "Description",
    //     "Platform",
    //     "Host",
    //     "Policy",
    //   ])
    // );
    // if (error) return res.status(400).send(error.details[0].message);

    if (!req.file) return res.status(400).send("Please upload a photo");

    const ext = req.file.mimetype.split("/")[1];
    if (!["png", "jpg", "jpeg", "webp"].includes(ext)) {
      return res.status(400).send("Unsupported image file");
    }

    const uploadResult = await uploadImageToS3(req.file, imageBucketName);
    console.log(uploadResult)
    // const event = new Event({
    //   ..._.omit(data, ["id"]),
    //   short_description: data["Short description"],
    //   image: uploadResult.link,
    //   imageKey: uploadResult.key,
    // });
    const event = new Event({
      ...data,
      image: uploadResult.link,
      imageKey: uploadResult.key,
    })
    await event.save();

    // res
    // .status(201)
    // .send(_.omit(JSON.parse(JSON.stringify(event)), ["__v"]));
    res.status(201).send(event);
   
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send("Event not found");

    await deleteFileByFileNameFromS3(event.imageKey,imageBucketName);

    await Event.findByIdAndDelete(eventId);
    res.send("Event deleted");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = { fetchEvents, createEvent, deleteEvent };
