import { Router } from "express";
import { validateResizeQueryParameters } from "../../utilities/resize";

const routes = Router();

routes.get("/", (req, res) => {
  res.send("At API root endpoint");
});

routes.get("/resize", validateResizeQueryParameters, async (req, res) => {
  res.send("Resized image");
});

export default routes;
