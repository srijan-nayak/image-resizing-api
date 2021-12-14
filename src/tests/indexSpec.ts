import app from "../index";
import supertest from "supertest";
import { existsSync, statSync } from "fs";
import { mkdir, rename, rm } from "fs/promises";
import { join } from "path";

const request = supertest(app);

describe("GET /", () => {
  it("should return status code of 200", async () => {
    const response = await request.get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /api/resize?image=twig.jpg&width=600&height=400", () => {
  const THUMBNAILS_TEST_DIR = "thumbnails";
  const THUMBNAILS_ORIGINAL_DIR = `${THUMBNAILS_TEST_DIR}.original`;

  beforeAll(async () => {
    if (existsSync(THUMBNAILS_TEST_DIR)) {
      await rename(THUMBNAILS_TEST_DIR, THUMBNAILS_ORIGINAL_DIR);
    }
    await mkdir(THUMBNAILS_TEST_DIR);
  });

  afterAll(async () => {
    await rm(THUMBNAILS_TEST_DIR, { recursive: true, force: true });
    if (existsSync(THUMBNAILS_ORIGINAL_DIR)) {
      await rename(THUMBNAILS_ORIGINAL_DIR, THUMBNAILS_TEST_DIR);
    }
  });

  it("should return status code of 200", async () => {
    const response = await request.get(
      "/api/resize?image=twig.jpg&width=600&height=400"
    );
    expect(response.statusCode).toBe(200);
  });

  it("should return an resized image", async () => {
    const response = await request.get(
      "/api/resize?image=twig.jpg&width=600&height=400"
    );
    const contentType = response.headers["content-type"];
    // check if the response body is generic binary data like an image
    expect(contentType).toMatch(/image\/*/);
  });

  it("should use cached resized image when called again", async () => {
    const resizedImagePath = join(THUMBNAILS_TEST_DIR, "twig-600x400.jpg");

    const resizedImageCreationTime = statSync(resizedImagePath, {
      throwIfNoEntry: false,
    })?.ctime;

    await request.get("/api/resize?image=twig.jpg&width=600&height=400");

    const newResizedImageCreationTime = statSync(resizedImagePath, {
      throwIfNoEntry: false,
    })?.ctime;

    expect(resizedImageCreationTime).toBeDefined();
    expect(newResizedImageCreationTime).toBeDefined();
    expect(newResizedImageCreationTime?.toISOString()).toBe(
      resizedImageCreationTime?.toISOString()
    );
  });
});

describe("GET /api/resize?image=railway.jpg&height=800", () => {
  it("should should return status code of 404", async () => {
    const response = await request.get(
      "/api/resize?image=railway.jpg&height=800"
    );
    expect(response.statusCode).toBe(404);
  });

  it("should should return a proper error message for missing parameters", async () => {
    const response = await request.get(
      "/api/resize?image=railway.jpg&height=800"
    );
    expect(response.text).toBe("Error: Missing required query parameters");
  });
});

describe("GET /api/resize?image=missing.jpg&width=534&height=800", () => {
  it("should return status code of 404", async () => {
    const response = await request.get(
      "/api/resize?image=missing.jpg&width=534&height=800"
    );
    expect(response.statusCode).toBe(404);
  });

  it("should return a proper error message for missing image", async () => {
    const response = await request.get(
      "/api/resize?image=missing.jpg&width=534&height=800"
    );
    expect(response.text).toBe("Error: missing.jpg not found in images/");
  });
});

describe("GET /api/resize?image=twig.jpg&width=-6000&height=-400", async () => {
  it("should return status code of 404", async () => {
    const response = await request.get(
      "/api/resize?image=twig.jpg&width=-6000&height=-400"
    );
    expect(response.statusCode).toBe(404);
  });

  it("should return a proper error message for invalid dimensions", async () => {
    const response = await request.get(
      "/api/resize?image=twig.jpg&width=-6000&height=-400"
    );
    expect(response.text).toBe("Error: invalid resizing dimensions");
  });
});
