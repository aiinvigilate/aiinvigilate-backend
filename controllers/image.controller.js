import multer from "multer";
import fs from 'fs';
import AWS from 'aws-sdk';
import cloudinary from 'cloudinary';
import prisma from '../lib/prisma.js';
import { log } from "console";

// Configure AWS Rekognition
const rekognition = new AWS.Rekognition({
    region: 'us-east-1', // Replace with your AWS region
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set in .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set in .env
});

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload the first image to Cloudinary when the test starts
export const uploadFirstImageWhenTestStart = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.path);


    log('Image uploaded to Cloudinary:', result);

    // Save the image URL to the database
    const image = await prisma.image.create({
      data: {
        testId: req.body.testId,
        userId: req.user.id,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
    });



    res.status(200).json({ message: 'First image uploaded successfully.', image });
  } catch (error) {
    console.log(error);
    
    console.error('Error uploading first image:', error);
    res.status(500).json({ error: 'Failed to upload first image.' });
  }
};

// Compare the second image with the first image stored in Cloudinary
export const compareImageWithFirstImage = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // Retrieve the first image from the database
    const firstImage = await prisma.image.findFirst({
      where: { testId: req.body.testId, userId: req.user.id },
    });

    if (!firstImage) {
      return res.status(400).json({ error: 'No first image found for this test.' });
    }

    // Upload the second image to Cloudinary
    const secondImageResult = await cloudinary.v2.uploader.upload(file.path);

    // Use AWS Rekognition or other comparison logic here
    const isMatch = true; // Placeholder for actual comparison logic

    // Clean up local file
    fs.unlinkSync(file.path);

    res.status(200).json({ isMatch, firstImageUrl: firstImage.imageUrl, secondImageUrl: secondImageResult.secure_url });
  } catch (error) {
    console.error('Error comparing images:', error);
    res.status(500).json({ error: 'Failed to compare images.' });
  }
};

// Delete the image from Cloudinary when the test is finished
export const deleteImage = async (req, res) => {
  try {
    // Retrieve the image from the database
    const image = await prisma.image.findFirst({
      where: { testId: req.body.testId, userId: req.user.id },
    });

    if (!image) {
      return res.status(400).json({ error: 'No image found for this test.' });
    }

    // Delete the image from Cloudinary
    await cloudinary.v2.uploader.destroy(image.publicId);

    // Delete the image record from the database
    await prisma.image.delete({ where: { id: image.id } });

    res.status(200).json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image.' });
  }
};

