import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dxq6q6ng5',
  api_key: '383717525657889',
  api_secret: 'ECDmKVb7gnMrN_FvFf-xYH6ZZK8',
});

// Verify Cloudinary connection
cloudinary.api.ping()
  .then(() => console.log('Cloudinary configured successfully'))
  .catch((err) => console.error('Cloudinary configuration failed:', err));

export default cloudinary;
