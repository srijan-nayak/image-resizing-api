import { writeResizedImage } from "../../utilities/resize";

import { existsSync } from "fs";
import { mkdir, rename, rm } from "fs/promises";
import { join } from "path";

describe("writeResizeImage", async () => {
  const THUMBNAILS_TEST_DIR = "thumbnails";
  const THUMBNAILS_ORIGINAL_DIR = `${THUMBNAILS_TEST_DIR}.original`;

  beforeAll(async () => {
    if (existsSync(THUMBNAILS_TEST_DIR)) {
      await rename(THUMBNAILS_TEST_DIR, THUMBNAILS_ORIGINAL_DIR);
    }
  });

  beforeEach(async () => {
    await mkdir(THUMBNAILS_TEST_DIR);
  });

  afterEach(async () => {
    await rm(THUMBNAILS_TEST_DIR, { recursive: true, force: true });
  });

  afterAll(async () => {
    if (existsSync(THUMBNAILS_ORIGINAL_DIR)) {
      await rename(THUMBNAILS_ORIGINAL_DIR, THUMBNAILS_TEST_DIR);
    }
  });

  it("should write resized image in the thumbnails directory", async () => {
    await writeResizedImage("hibiscus.jpg", 600, 400);
    expect(existsSync(join(THUMBNAILS_TEST_DIR, "hibiscus-600x400.jpg"))).toBe(
      true
    );
  });
});
