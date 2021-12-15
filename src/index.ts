import express from "express";
import routes from "./routes/api";
import { existsSync, mkdirSync } from "fs";

const app = express();
const PORT = 3000;

if (!existsSync("images")) {
  mkdirSync("images");
}

if (!existsSync("thumbnails")) {
  mkdirSync("thumbnails");
}

app.get("/", (req, res) => {
  res.send("At root endpoint");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
