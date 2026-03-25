#!/usr/bin/env node

'use strict';

require('dotenv').config();
const { Command } = require('commander');
const fs = require('fs');
const Sharinpix = require('../src/sharinpix');

if (!process.env.SHARINPIX_URL) {
  console.error('Environment variable SHARINPIX_URL not configured');
  process.exit(1);
}

const program = new Command();

program
  .name('sharinpix')
  .description('SharinPix CLI tool')
  .version(require('../package.json').version);

program
  .command('import <url> <albumId> [metadatas]')
  .description('Import an image from a URL into an album')
  .action(async (url, albumId, metadatas) => {
    try {
      const meta = JSON.parse(metadatas || '{}');
      const image = await Sharinpix.import(url, albumId, meta);
      console.log(image, 'SUCCESS');
    } catch (error) {
      console.error(error, 'ERROR');
      process.exit(1);
    }
  });

program
  .command('images:delete <imageId>')
  .description('Delete an image by ID')
  .action(async (imageId) => {
    try {
      const res = await Sharinpix.imageDelete(imageId);
      console.log(res);
    } catch (error) {
      console.error(error, 'ERROR');
      process.exit(1);
    }
  });

program
  .command('upload <image> <albumId> [metadatas]')
  .description('Upload a local image to an album')
  .action(async (image, albumId, metadatas) => {
    try {
      const meta = JSON.parse(metadatas || '{}');
      const result = await Sharinpix.upload(image, albumId, meta);
      console.log(result, 'SUCCESS');
    } catch (error) {
      console.error(error, 'ERROR');
      process.exit(1);
    }
  });

program
  .command('multiupload <csvFile>')
  .description('Upload multiple images from a CSV file')
  .action(async (csvFile) => {
    try {
      const data = fs.readFileSync(csvFile, 'utf8');
      console.log('CSV file is being processed');
      const results = await Sharinpix.multiupload(data);
      console.log('Done!', results);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('test')
  .description('Validate SHARINPIX_URL and test API connectivity')
  .action(async () => {
    const url = process.env.SHARINPIX_URL;
    let parsed;

    try {
      parsed = new URL(url);
    } catch {
      console.error('FAIL: SHARINPIX_URL is not a valid URL');
      process.exit(1);
    }

    const id = decodeURIComponent(parsed.username);
    const secret = decodeURIComponent(parsed.password);
    const endpoint = `https://${parsed.host}${parsed.pathname}`.replace(/\/$/, '');

    if (!id || !secret) {
      console.error('FAIL: SHARINPIX_URL is missing credentials (expected https://<id>:<secret>@<host>)');
      process.exit(1);
    }

    console.log(`Endpoint : ${endpoint}`);
    console.log(`ID       : ${id}`);
    console.log(`Secret   : ${secret.slice(0, 4)}${'*'.repeat(Math.max(0, secret.length - 4))}`);
    console.log();

    try {
      const instance = Sharinpix.getInstance();
      const token = instance.token({ admin: true });
      console.log('JWT token : OK');
    } catch (error) {
      console.error('FAIL: Could not generate JWT token:', error.message);
      process.exit(1);
    }

    try {
      await Sharinpix.getInstance().get('/albums', { admin: true });
      console.log('API call  : OK');
      console.log();
      console.log('Connection successful.');
    } catch (error) {
      const status = error.status || error.code || 'unknown';
      console.error(`API call  : FAILED (${status})`);
      if (error.status === 401 || error.status === 403) {
        console.error('Credentials are invalid or lack permissions.');
      } else if (error.code === 'ENOTFOUND') {
        console.error(`Host "${parsed.hostname}" could not be resolved.`);
      } else if (error.code === 'ECONNREFUSED') {
        console.error(`Connection refused by ${parsed.host}.`);
      } else {
        console.error(error.message);
      }
      process.exit(1);
    }
  });

program.parse();
