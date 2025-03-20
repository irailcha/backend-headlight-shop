import express from "express";
import advertController from "../controllers/advert-controller.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { isValidId } from "../middlewares/isValidId.js";

const advertRouter = express.Router();

advertRouter.get("/", advertController.getAdverts);

advertRouter.post("/", advertController.addAdvert);

advertRouter.get("/:id", isValidId, advertController.getAdvertById);

advertRouter.put("/:id", isValidId, advertController.updateAdvert);

advertRouter.delete("/:id", isValidId, advertController.deleteAdvert);

export default advertRouter;
