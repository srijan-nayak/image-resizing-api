import { Router } from "express";
import writeResizedImage, {
  checkCachedResizedImages,
  resizedImagePath,
  validateResizeQueryParameters,
} from "../../utilities/resize";
import { realpathSync } from "fs";

const routes = Router();

routes.get("/", (req, res) => {
  res.send("At API root endpoint");
});

routes.get(
  "/resize",
  validateResizeQueryParameters,
  checkCachedResizedImages,
  async (req, res) => {
    const { image, width, height } = req.query;
    await writeResizedImage(
      image as string,
      Number.parseInt(width as string),
      Number.parseInt(height as string)
    );
    res.sendFile(
      realpathSync(
        resizedImagePath(
          image as string,
          Number.parseInt(width as string),
          Number.parseInt(height as string)
        )
      )
    );
  }
);

export default routes;
