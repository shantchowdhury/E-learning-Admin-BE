const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:'ap-south-1'
});

const s3 = new AWS.S3();

const checkFileExistenceInS3 = async(fileName, storage) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: storage,
      Key: fileName,
    };

    s3.headObject(params, (err, data) => {
      if (err && err.statusCode === 404) {
        // File does not exist
        resolve(false);
      } else if (err) {
        console.error("Error checking file existence in S3:", err);
        reject("Error checking file existence in S3");
      } else {
        // File exists
        resolve(true);
      }
    });
  });
};

const uploadImageToS3 = async (file, storage) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.buffer) {
        return reject("No image file provided");
      }
  
      const imageStream = require("stream").Readable.from(file.buffer);
      const currentTime = new Date().toISOString().replace(/[-:.]/g, "");
      const uniqueFileName = `${currentTime}_${file.originalname}`;
  
      const params = {
        Bucket: storage,
        Key: uniqueFileName,
        Body: imageStream,
        ACL: "public-read",
        ContentType: file.mimetype,
        ContentDisposition: "inline",
      };
  
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading image to S3:", err);
          reject("Error uploading image to S3");
        } else {
          // const imageLink = s3.getSignedUrl("getObject", {
          //   Bucket: storage,
          //   Key: data.key,
          // });

          const imageLink = `https://${storage}.s3.amazonaws.com/${data.key}`;
  
          resolve({
            message: "Image uploaded successfully",
            link: imageLink,
            key:`${data.key}`
        
          });
        }
      });
    });
  };

  const getAllFileLinksFromS3 = async (storage) => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: storage,
      };
  
      s3.listObjects(params, (err, data) => {
        if (err) {
          console.error("Error retrieving files from S3:", err);
          reject("Error retrieving files from S3");
        } else {
          const fileLinks = data.Contents.map((obj) => {
            const fileUrl = s3.getSignedUrl("getObject", {
              Bucket: storage,
              Key: obj.Key,
            });
  
            return {
              Key: obj.Key,
              Link: fileUrl,
            };
          });
  
          resolve(fileLinks);
        }
      });
    });
  };


const getFileLinkByFileNameFromS3 = (fileName, storage) => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: storage,
        Key: fileName,
      };
  
      s3.headObject(params, (err, data) => {
        if (err) {
          console.error("Error retrieving file from S3:", err);
          reject("Error retrieving file from S3");
        } else {
          const fileUrl = s3.getSignedUrl("getObject", {
            Bucket: storage,
            Key: fileName,
          });
  
          resolve({ fileName, link: fileUrl });
        }
      });
    });
  };

  
  const updateFileByFileNameInS3 = async (fileName, newFile, storage) => {

    return new Promise((resolve, reject) => {
      const deleteParams = {
        Bucket: storage,
        Key: fileName,
      };
  
      s3.deleteObject(deleteParams, (err, data) => {
        if (err) {
          console.error("Error deleting file from S3:", err);
          reject("Error deleting file from S3");
        } else {
          if (!newFile || !newFile.buffer) {
            reject("No file provided");
          }
  
          const fileStream = require("stream").Readable.from(newFile.buffer);
  
          const params = {
            Bucket: storage,
            Key: newFile.originalname,
            Body: fileStream,
            ACL: "public-read",
            ContentType: newFile.mimetype,
            ContentDisposition: "inline",
          };
  
          s3.upload(params, (uploadErr, uploadData) => {
            if (uploadErr) {
              console.error("Error uploading file to S3:", uploadErr);
              reject("Error uploading file to S3");
            } else {
              const fileUrl = s3.getSignedUrl("getObject", {
                Bucket: storage,
                Key: uploadData.key,
              });
  
              resolve({
                message: "File uploaded successfully",
                link: fileUrl,
                key:uploadData.key
              });
            }
          });
        }
      });
    });
  };

  const deleteFileByFileNameFromS3 = (fileName, storage) => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: storage,
        Key: fileName,
      };
  
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error("Error deleting file from S3:", err);
          reject("Error deleting file from S3");
        } else {
          resolve({ message: "File deleted successfully" });
        }
      });
    });
  };
  
  const deleteAllFilesFromS3 = (storage) => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: storage,
      };
  
      s3.listObjects(params, (err, data) => {
        if (err) {
          console.error("Error listing files in S3:", err);
          reject("Error listing files in S3");
        } else {
          if (data.Contents.length === 0) {
            resolve({ message: "No files found in the bucket" });
          } else {
            const deleteParams = {
              Bucket: storage,
              Delete: { Objects: [] },
            };
  
            data.Contents.forEach((file) => {
              deleteParams.Delete.Objects.push({ Key: file.Key });
            });
  
            s3.deleteObjects(deleteParams, (deleteErr, deleteData) => {
              if (deleteErr) {
                console.error("Error deleting files from S3:", deleteErr);
                reject("Error deleting files from S3");
              } else {
                resolve({ message: "All files deleted successfully" });
              }
            });
          }
        }
      });
    });
  };
  
  module.exports = {
    checkFileExistenceInS3,
    uploadImageToS3,
    getAllFileLinksFromS3,
    getFileLinkByFileNameFromS3,
    updateFileByFileNameInS3,
    deleteFileByFileNameFromS3,
    deleteAllFilesFromS3
  };
  



