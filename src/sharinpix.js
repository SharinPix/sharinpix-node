'use strict';

const jsrsasign = require('jsrsasign');
const superagent = require('superagent');
const { parseString } = require('fast-csv');
const path = require('path');
const fs = require('fs');

class Sharinpix {
  constructor(options) {
    this.options = options;
  }

  apiUrl(endpoint) {
    return `${this.options.endpoint}${endpoint}`;
  }

  token(claims) {
    claims.iss = this.options.id;
    return jsrsasign.jws.JWS.sign(
      null,
      { alg: 'HS256', cty: 'JWT' },
      JSON.stringify(claims),
      { rstr: this.options.secret }
    );
  }

  async post(endpoint, body, claims = { admin: true }) {
    const res = await superagent
      .post(this.apiUrl(endpoint))
      .set('Authorization', `Token token="${this.token(claims)}"`)
      .set('Accept', 'application/json')
      .send(body);
    return res.body;
  }

  async put(endpoint, body, claims = { admin: true }) {
    const res = await superagent
      .put(this.apiUrl(endpoint))
      .set('Authorization', `Token token="${this.token(claims)}"`)
      .set('Accept', 'application/json')
      .send(body);
    return res.body;
  }

  async get(endpoint, claims = { admin: true }) {
    const res = await superagent
      .get(this.apiUrl(endpoint))
      .set('Authorization', `Token token="${this.token(claims)}"`)
      .set('Accept', 'application/json');
    return res.body;
  }

  async delete(endpoint, claims = { admin: true }) {
    try {
      await superagent
        .delete(this.apiUrl(endpoint))
        .set('Authorization', `Token token="${this.token(claims)}"`)
        .set('Accept', 'application/json');
      return true;
    } catch (err) {
      if (err.status === 404) return true;
      throw err;
    }
  }

  async imageDelete(imageId) {
    return this.delete(`/images/${imageId}`);
  }

  async upload(image, albumId, metadatas = {}) {
    const claims = {
      abilities: {
        [albumId]: {
          Access: { see: true, image_upload: true },
        },
      },
    };

    let fileName, fileSize, mimeType;

    if (typeof File !== 'undefined' && image instanceof File) {
      fileName = image.name;
      fileSize = image.size;
      mimeType = image.type;
    } else {
      const stat = fs.statSync(image);
      fileName = path.basename(image);
      fileSize = stat.size;
      mimeType = getMimeType(fileName);
    }

    const storageFile = await this.post(
      '/storages/default/storage_files',
      {
        album_id: albumId,
        name: fileName,
        type: mimeType,
        size: fileSize,
        metas: { name: fileName, type: mimeType, attrs: {} },
        image_metadatas: metadatas,
      },
      claims
    );

    const { url, fields } = storageFile.upload_parameters;
    const uploadReq = superagent.post(url);

    for (const [key, value] of Object.entries(fields)) {
      uploadReq.field(key, value);
    }

    if (typeof File !== 'undefined' && image instanceof File) {
      uploadReq.field('file', image);
    } else {
      uploadReq.attach('file', fs.createReadStream(image), {
        filename: fileName,
        contentType: mimeType,
      });
    }

    const s3Res = await uploadReq;

    return this.put(
      `/storage_files/${storageFile.id}`,
      {
        infos: {
          'content-length': s3Res.headers['content-length'] || '0',
          'etag': s3Res.headers['etag'],
          'ETag': s3Res.headers['etag'],
          'location': s3Res.headers['location'],
        },
      },
      claims
    );
  }

  async import(url, albumId, metadatas = {}) {
    return this.post('/imports', {
      import_type: 'url',
      album_id: albumId,
      url,
      metadatas,
    });
  }

  multiupload(csvString) {
    return new Promise((resolve, reject) => {
      const tasks = [];

      parseString(csvString.toString(), { headers: false })
        .on('error', reject)
        .on('data', (data) => {
          const filePath = data[0];
          const albumId = data[1];
          if (!filePath || !albumId) return;

          tasks.push(async () => {
            try {
              if (filePath.startsWith('http')) {
                return { value: await this.import(filePath, albumId) };
              }
              const resolved = path.isAbsolute(filePath)
                ? filePath
                : path.resolve(filePath);
              return { value: await this.upload(resolved, albumId) };
            } catch (error) {
              return { error };
            }
          });
        })
        .on('end', async () => {
          try {
            const results = await runWithConcurrency(tasks, 2);
            resolve(results);
          } catch (err) {
            reject(err);
          }
        });
    });
  }
}

async function runWithConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = task().then((result) => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

let _options;
let _singleton;

Sharinpix.configure = function (options) {
  if (_options === undefined) {
    _options = {};
    if (process?.env?.SHARINPIX_URL) {
      Sharinpix.configure(process.env.SHARINPIX_URL);
    }
  }

  if (options) {
    if (typeof options === 'string') {
      const parsed = new URL(options);
      _options.endpoint = `https://${parsed.host}${parsed.pathname}`.replace(/\/$/, '');
      _options.id = decodeURIComponent(parsed.username);
      _options.secret = decodeURIComponent(parsed.password);
    } else if (typeof options === 'object') {
      Object.assign(_options, options);
    }
  }

  return _options;
};

Sharinpix.getInstance = function () {
  if (_singleton) return _singleton;
  _singleton = new Sharinpix(Sharinpix.configure());
  return _singleton;
};

Sharinpix.get_instance = Sharinpix.getInstance;

Sharinpix.import = function (...args) {
  return Sharinpix.getInstance().import(...args);
};

Sharinpix.upload = function (...args) {
  return Sharinpix.getInstance().upload(...args);
};

Sharinpix.multiupload = function (...args) {
  return Sharinpix.getInstance().multiupload(...args);
};

Sharinpix.imageDelete = function (...args) {
  return Sharinpix.getInstance().imageDelete(...args);
};

Sharinpix.image_delete = Sharinpix.imageDelete;

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.pdf': 'application/pdf',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
};

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

module.exports = Sharinpix;
