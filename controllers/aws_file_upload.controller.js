const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();
const fixedBucketName = process.env.S3_FILE_BUCKET_NAME;

const uploadFileToS3 = (file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: fixedBucketName,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
      ContentDisposition: "inline",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

const uploadMultipleFilesToS3 = async (files) => {
  try {
    const uploadedFileURLs = await Promise.all(files.map(uploadFileToS3));
    return uploadedFileURLs;
  } catch (err) {
    throw new Error("Error uploading files to S3: " + err.message);
  }
};

module.exports = {
  uploadMultipleFilesToS3,
};
