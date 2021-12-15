import { NextFunction, Request, Response } from "express";
import { existsSync, realpathSync } from "fs";
import sharp from "sharp";
import { join } from "path";

export const validateResizeQueryParameters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image, width, height } = req.query;
  if (image === undefined || width === undefined || height === undefined) {
    res.status(404).send("Error: Missing required query parameters");
  } else if (!existsSync(`images/${image}`)) {
    res.status(404).send(`Error: ${image} not found in images/`);
  } else if (+width <= 0 || +height <= 0 || isNaN(+width) || isNaN(+height)) {
    res.status(404).send("Error: invalid resizing dimensions");
  } else {
    next();
  }
};

export const checkCachedResizedImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image, width, height } = req.query;
  const thumbnailPath = resizedImagePath(
    image as string,
    Number.parseInt(width as string),
    Number.parseInt(height as string)
  );
  if (existsSync(thumbnailPath)) {
    res.sendFile(realpathSync(thumbnailPath));
  } else {
    next();
  }
};

export const resizedImagePath = (
  imageFileName: string,
  width: number,
  height: number
) => {
  const imageName = imageFileName.split(".").slice(0, -1).join(".");
  const imageExtension = imageFileName.split(".").slice(-1);
  return join(
    "thumbnails",
    `${imageName}-${width}x${height}.${imageExtension}`
  );
};

const writeResizedImage = async (
  imageFileName: string,
  width: number,
  height: number
): Promise<void> => {
  const imagePath = join("images", imageFileName);
  const thumbnailPath = resizedImagePath(imageFileName, width, height);
  await sharp(imagePath)
    .resize({ width: width, height: height })
    .toFile(thumbnailPath);
};

export default writeResizedImage;
