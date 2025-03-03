// config.js
import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured at the start of the app
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary configured successfully');
