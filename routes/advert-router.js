import express from "express";
import advertController from "../controllers/advert-controller.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import upload from "../middlewares/upload.js";

const advertRouter = express.Router();

advertRouter.get("/", advertController.getAdverts);

advertRouter.post("/", isEmptyBody, upload.array("media", 10), advertController.addAdvert);

advertRouter.get("/:id", isValidId, advertController.getAdvertById);

advertRouter.put("/:id", isEmptyBody, upload.array("media", 10), advertController.updateAdvert);

advertRouter.delete("/:id", isValidId, advertController.deleteAdvert);

export default advertRouter;
