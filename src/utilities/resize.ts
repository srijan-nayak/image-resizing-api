import { NextFunction, Request, Response } from "express";
import { existsSync, realpathSync } from "fs";
import sharp from "sharp";
import { join } from "path";

/**
 * Express middleware to check if
 * - all required query parameters were provided
 * - an image with the image name provided exists in the images directory
 * - new width and height for resizing are greater than 0
 * Sends an appropriate error message if above conditions are not met, else
 * proceeds to the next middleware.
 *
 * @param req Express request object
 * @param res Express response object
 * @param next next function for proceeding to the succeeding middleware
 */
export const validateResizeQueryParameters = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

/**
 * Express middleware to check if a resized image exists in the thumbnails
 * directory that can satisfy the current request.
 *
 * @param req Express request object
 * @param res Express response object
 * @param next next function for proceeding to the succeeding middleware
 */
export const checkCachedResizedImages = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

/**
 * Computes the path name for the resized image. The file name in the path
 * includes the resizing dimensions.
 *
 * ## Example
 * `resizedImagePath("image.jpg", 400, 200) => "thumbnails/image-400x200.jpg"`
 *
 * @param imageFileName name of the image file with extension
 * @param width resizing width
 * @param height resizing height
 *
 * @returns computed thumbnail path
 */
export const resizedImagePath = (
  imageFileName: string,
  width: number,
  height: number
): string => {
  const imageName = imageFileName.split(".").slice(0, -1).join(".");
  const imageExtension = imageFileName.split(".").slice(-1);
  return join(
    "thumbnails",
    `${imageName}-${width}x${height}.${imageExtension}`
  );
};

/**
 * Resizes and writes the image with filename `imageFileName` in the images
 * directory to the thumbnails directory with dimensions included in the
 * filename.
 *
 * @param imageFileName name of the image file with extension
 * @param width resizing width
 * @param height resizing height
 */
export const writeResizedImage = async (
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
