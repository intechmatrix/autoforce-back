import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage for the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    const imageExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (imageExtensions.includes(ext)) {
      uploadPath = path.join(__dirname, '../public/images'); // For images
    } else if (videoExtensions.includes(ext)) {
      uploadPath = path.join(__dirname, '../public/videos'); // For videos
    } else {
      return cb(new Error('File type not supported'), false);
    }

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now() + '-' + file.originalname;
    cb(null, uniqueFilename);
  }
});

// Filter to validate file types
const fileFilter = (req, file, cb) => {
  const validExtensions = req.query.validExtensions
    ? req.query.validExtensions.split(',')
    : ['.webp', '.jpeg', '.jpg', '.png', '.svg', '.pdf', '.doc', '.mp4', '.avi', '.mov'];

  const ext = path.extname(file.originalname).toLowerCase();
  if (validExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

// Configure multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 100 } // 100MB file size limit
});

export default upload;


