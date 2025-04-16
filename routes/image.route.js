import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { uploadFirstImageWhenTestStart, compareImageWithFirstImage, deleteImage } from '../controllers/image.controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';
import axios from 'axios';
import fs from 'fs';
import AWS from 'aws-sdk';

// Configure AWS Rekognition
const rekognition = new AWS.Rekognition({
  region: 'us-east-1', // Replace with your AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set in .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set in .env
});

const router = express.Router();

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    resource_type: 'auto',
  },
});
const upload = multer({ storage });
  

// Routes
router.post('/upload-first', authenticateUser,  async (req, res, next) => {

  upload.single('image')(req, res, (err) => { 
    if (err instanceof multer.MulterError) {
      // Handle multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size is too large. Maximum allowed size is 5MB per file.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Unexpected field. Please use the correct field name for the files.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      if (err.message.includes('Only image files are allowed')) {
        return res.status(400).json({ error: 'Invalid file type. Only image files are allowed.' });
      }
      return res.status(500).json({ error: 'Error processing file upload' });
    }
  next();
  });
}, 

async (req, res) => {

  console.log(req.file);
  

  const userId = req.user.id;
  const { testId } = req.body;

      try {
        const uploadedResult = await  cloudinary.uploader.upload(req.file.path, { folder: 'users/face' })
        console.log(uploadedResult);
            // Save the image URL to the database
    const image = await prisma.image.create({
      data: {
        testId: parseInt(testId),
        userId:userId,
        imageUrl: uploadedResult.secure_url,
        publicId: uploadedResult.public_id,
      },
    });
  

    res.status(200).json({ message: 'First image uploaded successfully.', image });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error Image' });
      }
}); 



router.post('/compare', authenticateUser, upload.single('image'), async (req, res) => {
  const { testId } = req.body;
  const userId = req.user.id;

  try {
    // Retrieve the first image from the database
    const firstImage = await prisma.image.findFirst({
      where: { testId: parseInt(testId), userId: parseInt(userId) },
    });

    if (!firstImage) {
      return res.status(400).json({ error: 'No first image found for this test.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // console.log(file.path);
    

    // Read the uploaded file as a buffer
    const response1 = await axios.get(file.path, { responseType: 'arraybuffer' });
    
    // Download the first image from Cloudinary
    const response = await axios.get(firstImage.imageUrl, { responseType: 'arraybuffer' });
    const firstImageBuffer = Buffer.from(response.data);
    const secondImageBuffer = Buffer.from(response1.data);

    // Prepare parameters for AWS Rekognition
    const params = {
      SourceImage: { Bytes: firstImageBuffer },
      TargetImage: { Bytes: secondImageBuffer },
      SimilarityThreshold: 90,
    };

    // Call AWS Rekognition to compare faces
    const rekognitionResponse = await rekognition.compareFaces(params).promise();
    const isMatch = rekognitionResponse.FaceMatches && rekognitionResponse.FaceMatches.length > 0;

    return res.status(200).json({ message: 'Comparison complete', isMatch });
  } catch (error) {
    console.error('Error comparing images:', error);
    res.status(500).json({ error: 'Failed to compare images.', details: error.message });
  }
});
router.delete('/delete', authenticateUser, deleteImage);

export default router;