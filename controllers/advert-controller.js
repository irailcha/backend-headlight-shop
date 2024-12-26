import Advert from "../models/Advert.js";
import upload from "../middlewares/upload.js";

const getAdverts = async (req, res, next) => {
  try {
    const adverts = await Advert.find();
    if (!adverts || adverts.length === 0) {
      return res.status(404).json({ message: "No adverts found" });
    }
    res.json(adverts);
  } catch (err) {
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
    next(err);
  }
};

const addAdvert = async (req, res, next) => {
  try {
    upload.array("media", 10)(req, res, async (err) => { 
      if (err) {
        return res.status(400).json({ message: "Error uploading files", error: err });
      }

      const updatedData = {
        ...req.body,
        photo: req.files ? req.files.filter(file => file.mimetype.startsWith("image")).map(file => file.path) : undefined,
        video: req.files ? req.files.filter(file => file.mimetype.startsWith("video")).map(file => file.path) : undefined,
      };

      const newAdvert = new Advert(updatedData);
      const savedAdvert = await newAdvert.save();
      res.status(201).json(savedAdvert);
    });
  } catch (err) {
    next(err);
  }
};

const updateAdvert = async (req, res, next) => {
  try {
    upload.array("media", 10)(req, res, async (err) => { 
      if (err) {
        return res.status(400).json({ message: "Error uploading files", error: err });
      }

      const updatedData = {
        ...req.body,
        photo: req.files ? req.files.filter(file => file.mimetype.startsWith("image")).map(file => file.path) : undefined,
        video: req.files ? req.files.filter(file => file.mimetype.startsWith("video")).map(file => file.path) : undefined,
      };

      const updatedAdvert = await Advert.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      if (!updatedAdvert) {
        return res.status(404).json({ message: "Advert not found" });
      }

      res.json(updatedAdvert);
    });
  } catch (err) {
    next(err);
  }
};

const deleteAdvert = async (req, res, next) => {
  try {
    const deletedAdvert = await Advert.findByIdAndDelete(req.params.id);
    if (!deletedAdvert) {
      return res.status(404).json({ message: "Advert not found" });
    }
    res.status(200).json({ message: "Advert successfully deleted" });
  } catch (err) {
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
