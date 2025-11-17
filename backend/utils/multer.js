import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadFile = (folderName, options = {}) => {
  const uploadPath = path.join('uploads', folderName);

  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const maxSize = options.maxSize || 10 * 1024 * 1024; // default 10 MB
  const allowedTypes = options.allowedTypes || /jpeg|jpg|png|webp/;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error('Invalid file type'));
  };

  return multer({ storage, fileFilter, limits: { fileSize: maxSize } });
};