import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.fieldname}${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
  const fileType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (fileType && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, 
});

export default upload;
