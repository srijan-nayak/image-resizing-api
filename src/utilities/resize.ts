import { NextFunction, Request, Response } from "express";
import { existsSync } from "fs";

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

const writeResizedImage = async (
  imageName: string,
  width: number,
  height: number
): Promise<void> => {
  if (!existsSync(`images/${imageName}`)) {
    throw new Error("Error: Specified image not found in images/");
  } else if (width <= 0 || height <= 0) {
    throw new Error("Error: New dimensions can't be negative");
  }
};

export default writeResizedImage;
