import { Router, Request, Response } from "express";
import {
  checkCachedResizedImages,
  resizedImagePath,
  validateResizeQueryParameters,
  writeResizedImage,
} from "../../utilities/resize";
import { realpathSync } from "fs";

const routes = Router();

routes.get("/", (req: Request, res: Response): void => {
  res.send("At API root endpoint");
});

routes.get(
  "/resize",
  validateResizeQueryParameters,
  checkCachedResizedImages,
  async (req: Request, res: Response): Promise<void> => {
    const imageFileName = req.query.image as string;
    const width = Number.parseInt(req.query.width as string);
    const height = Number.parseInt(req.query.height as string);
    await writeResizedImage(imageFileName, width, height);
    res.sendFile(realpathSync(resizedImagePath(imageFileName, width, height)));
  }
);

export default routes;
