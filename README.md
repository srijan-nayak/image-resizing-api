# Image resizing API

An API built with Express and Sharp that serves resized version of images.

Images stored in the "images" directory at the root of the project can be
resized by making `GET` requests to the `/api/resize` endpoint with appropriate
query parameters. When possible, the server will serve cached resized images
without resizing images again and again.

## Installation

```bash
git clone https://github.com/srijan-nayak/image-resizing-api.git
cd image-resizing-api
npm i
```

## Usage

Start the server.

```bash
npm start
# or
npm run build
node dist/
```

Add some images in the "images" directory at the root of the project.

```
.
├── ...
├── images
│   ├── hibiscus.jpg
│   ├── railway.jpg
│   ├── tower.jpg
│   └── twig.jpg
└── ...
```

Make a get request to the resize endpoint passing with the following query
parameters:-

- `image`: Image name in the "images" directory **with the file extension**
- `width`: Resizing width
- `height`: Resizing height

```http request
GET http://localhost:3000/api/resize?image=hibiscus.jpg&width=600&height=400
```

The resized image will be sent back as a response and the thumbnail will be 
stored in the "thumbnails" directory with the resizing dimensions included in
the thumbnail name.

```
.
├── ...
├── images
│   ├── hibiscus.jpg
│   ├── railway.jpg
│   ├── tower.jpg
│   └── twig.jpg
├── thumbnails
│   └── hibiscus-600x400.jpg
└── ...
```

## Tests

Run unit and endpoint tests.

```bash
npm run test
```

## NPM scripts

- `start`: Start the server directly from the typescript file with nodemon
- `test`: Run tests
- `build`: Build in production mode without including any tests or source maps
- `dev-build`: Build in development mode with tests and source maps
- `lint`: Lint all files in src with eslint
- `format`: Format all files in src with prettier
