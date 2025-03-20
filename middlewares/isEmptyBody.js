import { HttpError } from "../helpers/HttpError.js";

export const isEmptyBody = async (req, res, next) => {
  const keys = Object.keys(req.body);
  const files = req.files || [];

  // Перевіряємо, чи є поля в тілі запиту або файли
  if (keys.length === 0 && files.length === 0) {
    return next(HttpError(400, "Body must contain fields or media files"));
  }

  next();
};
