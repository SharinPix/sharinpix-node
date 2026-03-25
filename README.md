# SharinPix Client

Node.js client library and CLI for the SharinPix API.

## Installation

```bash
npm install sharinpix
```

## Configuration

Set the `SHARINPIX_URL` environment variable with your SharinPix secret URL:

```bash
export SHARINPIX_URL="https://<id>:<secret>@<api-host>/api/v1"
```

Or configure programmatically:

```javascript
const Sharinpix = require('sharinpix');
Sharinpix.configure('https://<id>:<secret>@<api-host>/api/v1');
```

## Usage

### Upload an image

```javascript
const Sharinpix = require('sharinpix');

const image = await Sharinpix.upload('./photo.jpg', 'album_id');
console.log(image.public_id);
```

### Import from URL

```javascript
const image = await Sharinpix.import('https://example.com/photo.jpg', 'album_id');
console.log(image.public_id);
```

### Delete an image

```javascript
await Sharinpix.imageDelete('image_id');
```

### Bulk upload from CSV

```javascript
const fs = require('fs');
const csv = fs.readFileSync('uploads.csv', 'utf8');
const results = await Sharinpix.multiupload(csv);
```

CSV format: `<file_path_or_url>,<album_id>` (one per line).

## CLI

### Install globally

```bash
npm install -g sharinpix
```

### Commands

```bash
# Upload a local image
sharinpix upload <image-path> <album-id> [metadatas-json]

# Import from URL
sharinpix import <url> <album-id> [metadatas-json]

# Delete an image
sharinpix images:delete <image-id>

# Bulk upload from CSV
sharinpix multiupload <csv-file>
```

## License

MIT
