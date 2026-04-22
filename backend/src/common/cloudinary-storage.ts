/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'books',

      // 🔥 FIX THIS
      resource_type: 'raw',

      // optional but clean
      public_id: Date.now() + '-' + file.originalname,
    };
  },
});
