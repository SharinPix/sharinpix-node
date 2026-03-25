'use strict';

require('dotenv').config();
const Sharinpix = require('./src/sharinpix');

Sharinpix.upload('./sharinpix.jpg', 'super_test')
  .then((image) => {
    console.log(image.public_id);
  })
  .catch((err) => {
    console.error('ERROR!', err);
  });
