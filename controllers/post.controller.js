const _ = require("lodash");
const Post = require("../models/post.js");
const User = require("../models/user.js");
const Category = require("../models/category.js");
const { postValidate } = require("../helpers/validation.js");

const {
  uploadImageToS3,
  deleteFileByFileNameFromS3,
} = require("../middleware/s3fileupload.js");


const imageBucketName = process.env.BLOG_IMAGE_BUCKET;

const fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("-__v")
      .populate({ path: "author category", select: "-_id Name" });
    res.send(posts);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const createPost = async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const { error } = postValidate(
      _.pick(data, ["Title", "Meta description", "Description", "Slug"])
    );
    if (error) return res.status(400).send(error.details[0].message);

    const checkSlug = await Post.findOne({ Slug: data.Slug });
    if (checkSlug) return res.status(400).send("Slug URL is already taken");

    if (!req.file) return res.status(400).send("Please upload a photo");

    const ext = req.file.mimetype.split("/")[1];
    if (!["png", "jpg", "jpeg", "webp"].includes(ext))
      return res.status(400).send("Unsupported image file");

    const uploadImage = await uploadImageToS3(req.file, imageBucketName);

    const post = new Post({
      ..._.omit(data, ["Meta description", "id"]),
      meta_description: data["Meta description"],
      image: uploadImage.link,
      imageKey: uploadImage.key,
    });
    await post.save();

    const author = await User.findById(post.author).select("-_id Name");
    const category = await Category.findById(post.category).select("-_id Name");
    const finalData = { ...post._doc, author, category };

    res
      .status(201)
      .send(_.omit(JSON.parse(JSON.stringify(finalData)), ["__v"]));
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const makeDraft = async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedData = await Post.findByIdAndUpdate(
      postId,
      { published: false },
      { new: true }
    );
    res.send(updatedData._id);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const makePublish = async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedData = await Post.findByIdAndUpdate(
      postId,
      { published: true },
      { new: true }
    );
    res.send(updatedData._id);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    await deleteFileByFileNameFromS3(post.imageKey,imageBucketName);

    const deletedData = await Post.findByIdAndDelete(postId);
    res.send(deletedData._id);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = { fetchPosts, createPost, makeDraft, makePublish, deletePost };
