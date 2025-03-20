import Advert from "../models/Advert.js";
import upload from "../middlewares/upload.js";
import cloudinary from "cloudinary";
import { promisify } from "util";

const uploadAsync = promisify(upload.array("photo", 10)); // Асинхронная версия загрузки файлов

const getAdverts = async (req, res, next) => {
  try {
    const adverts = await Advert.find();
    if (!adverts || adverts.length === 0) {
      return res.status(404).json({ message: "No adverts found" });
    }
    res.json(adverts);
  } catch (err) {
    console.error("Error fetching adverts:", err);
    next(err);
  }
};

const getAdvertById = async (req, res, next) => {
  try {
    const advert = await Advert.findById(req.params.id);
    if (!advert) {
      return res.status(404).json({ message: "Advert not found" });
    }
    res.json(advert);
  } catch (err) {
    console.error("Error fetching advert by ID:", err);
    next(err);
  }
};

const addAdvert = async (req, res, next) => {
  try {
    await uploadAsync(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const mediaUrls = req.files.map((file) => file.path);

    const newAdvert = new Advert({
      ...req.body,
      photo: mediaUrls,
    });

    const savedAdvert = await newAdvert.save();
    res.status(201).json(savedAdvert);
  } catch (err) {
    console.error("Error adding advert:", err);
    next(err);
  }
};

const updateAdvert = async (req, res, next) => {
  try {
    await uploadAsync(req, res);

    // Получаем текущие фотографии из req.body
    const currentPhotos = req.body.currentPhotos
      ? Array.isArray(req.body.currentPhotos)
        ? req.body.currentPhotos
        : [req.body.currentPhotos] // Если одна строка, превращаем в массив
      : [];

    // Формируем список новых фотографий
    const newPhotos = req.files
      .filter((file) => file.mimetype.startsWith("image"))
      .map((file) => file.path);

    // Объединяем текущие и новые фотографии
    const updatedPhotos = [...currentPhotos, ...newPhotos];

    // Формируем обновленные данные
    const updatedData = {
      ...req.body,
      photo: updatedPhotos,
      video: req.files
        .filter((file) => file.mimetype.startsWith("video"))
        .map((file) => file.path),
    };

    const updatedAdvert = await Advert.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedAdvert) {
      return res.status(404).json({ message: "Advert not found" });
    }

    res.json(updatedAdvert);
  } catch (err) {
    console.error("Error updating advert:", err);
    next(err);
  }
};

const deleteAdvert = async (req, res, next) => {
  try {
    const advert = await Advert.findById(req.params.id);
    if (!advert) {
      return res.status(404).json({ message: "Advert not found" });
    }

    // Удаляем фотографии из Cloudinary
    const deletePromises = advert.photo.map((photo) => {
      const publicId = photo.split("/").pop().split(".")[0]; // Извлекаем public_id
      return cloudinary.uploader.destroy(publicId);
    });
    await Promise.all(deletePromises);

    // Удаляем объявление из базы
    await Advert.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Advert successfully deleted" });
  } catch (err) {
    console.error("Error deleting advert:", err);
    next(err);
  }
};

export default {
  getAdverts,
  getAdvertById,
  addAdvert,
  updateAdvert,
  deleteAdvert,
};

