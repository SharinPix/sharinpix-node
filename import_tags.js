'use strict';

require('dotenv').config();
const fs = require('fs');
const { parse } = require('fast-csv');
const Sharinpix = require('./src/sharinpix');

const importId = Math.round(Math.random() * 10000);
const tasks = [];

fs.createReadStream('import.csv')
  .pipe(parse({ headers: false }))
  .on('data', (data) => {
    const albumId = data[0];
    const url = data[1];
    const tags = [data[2]];

    tasks.push(async () => {
      try {
        const res = await Sharinpix.getInstance().post('/imports', {
          import_type: 'url',
          album_id: albumId,
          url,
          tags,
          metadatas: { import_id: importId },
        });
        console.log('OK');
        return res;
      } catch (err) {
        console.log(`ERROR ${albumId};${url};${data[2]}`);
        throw err;
      }
    });
  })
  .on('end', async () => {
    const executing = new Set();
    for (const task of tasks) {
      const p = task()
        .catch(() => {})
        .finally(() => executing.delete(p));
      executing.add(p);
      if (executing.size >= 2) await Promise.race(executing);
    }
    await Promise.allSettled([...executing]);
    console.log('DONE!');
  });
