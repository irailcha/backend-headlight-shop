import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";


dotenv.config();
// Налаштування Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Налаштування сховища для Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Folder_1", // Папка, де зберігатимуться файли в Cloudinary
    allowed_formats: ["jpg", "png", "webp", "mp4", "mov"], // Дозволені формати
    resource_type: "auto", // Автоматичне визначення типу файлу
  },
});

// Ініціалізація Multer
const upload = multer({ storage });

export default upload;
