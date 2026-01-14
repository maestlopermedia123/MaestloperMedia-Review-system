import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '@/utils/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'upi_qr_codes',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

export default upload;
