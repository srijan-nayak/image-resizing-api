import { Router } from "express";

const routes = Router();

routes.get("/", (req, res) => {
  res.send("At API root endpoint");
});

export default routes;
