import { resizedImagePath, writeResizedImage } from "../../utilities/resize";

import { existsSync } from "fs";
import { mkdir, rename, rm } from "fs/promises";
import { join } from "path";

describe("resizedImagePath", (): void => {
  it("should compute thumbnail path with dimensions", (): void => {
    expect(resizedImagePath("tower.jpg", 533, 800)).toBe(
      "thumbnails/tower-533x800.jpg"
    );
  });
});

describe("writeResizeImage", async (): Promise<void> => {
  const THUMBNAILS_TEST_DIR = "thumbnails";
  const THUMBNAILS_ORIGINAL_DIR = `${THUMBNAILS_TEST_DIR}.original`;

  beforeAll(async (): Promise<void> => {
    if (existsSync(THUMBNAILS_TEST_DIR)) {
      await rename(THUMBNAILS_TEST_DIR, THUMBNAILS_ORIGINAL_DIR);
    }
  });

  beforeEach(async (): Promise<void> => {
    await mkdir(THUMBNAILS_TEST_DIR);
  });

  afterEach(async (): Promise<void> => {
    await rm(THUMBNAILS_TEST_DIR, { recursive: true, force: true });
  });

  afterAll(async (): Promise<void> => {
    if (existsSync(THUMBNAILS_ORIGINAL_DIR)) {
      await rename(THUMBNAILS_ORIGINAL_DIR, THUMBNAILS_TEST_DIR);
    }
  });

  it("should write resized image in the thumbnails directory", async (): Promise<void> => {
    await writeResizedImage("hibiscus.jpg", 600, 400);
    expect(existsSync(join(THUMBNAILS_TEST_DIR, "hibiscus-600x400.jpg"))).toBe(
      true
    );
  });
});
