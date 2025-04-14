import multer from "multer";
import fs from 'fs';
import AWS from 'aws-sdk';

// Configure AWS Rekognition
const rekognition = new AWS.Rekognition({
    region: 'us-east-1', // Replace with your AWS region
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set in .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set in .env
});
  

export const uploadFirstImageWhenTestStart = async (req, res) => { 
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  try {
    firstImagePath = file.path; // Save the file path in memory
    res.status(200).json({firstImagePath: firstImagePath,  message: 'First image uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading first image:', error);
    res.status(500).json({ error: 'Failed to upload first image.' });
  }
};

// Compare the second image with the first image
export const comapreImageWithFirstImage = async (req, res) => { 
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  if (!firstImagePath) {
    return res.status(400).json({ error: 'No first image uploaded yet.' });
  }

  try {
    const secondImageBuffer = fs.readFileSync(file.path);
    const firstImageBuffer = fs.readFileSync(firstImagePath);

    const params = {
      SourceImage: { Bytes: firstImageBuffer },
      TargetImage: { Bytes: secondImageBuffer },
      SimilarityThreshold: 90, // Adjust similarity threshold as needed
    };

    const response = await rekognition.compareFaces(params).promise();
    const isMatch = response.FaceMatches && response.FaceMatches.length > 0;

    // Clean up uploaded files
    fs.unlinkSync(file.path);
    fs.unlinkSync(firstImagePath);
    firstImagePath = null;

    res.status(200).json({ isMatch , response: response });
  } catch (error) {
    console.error('Error comparing images:', error);
    res.status(500).json({ error: 'Failed to compare images.' });
  }
};

