'use strict';

/**
 * testR2.js — STANDALONE one-shot smoke test for the Cloudflare R2 client.
 *
 * What it does (in order):
 *   1. Prints which env vars are set (values redacted).
 *   2. Uploads a small text blob to a throwaway key under `_smoke-test/`.
 *   3. Generates a presigned GET URL (60s expiry).
 *   4. Fetches the URL with built-in https (no extra deps) and asserts the
 *      downloaded bytes match the uploaded bytes.
 *   5. Verifies objectExists() returns true.
 *   6. Deletes the object.
 *   7. Verifies objectExists() returns false.
 *
 * Each step prints PASS/FAIL with a short reason. Exit code is 0 on full pass,
 * 1 on any failure. No app code is touched and no DB connection is opened.
 *
 * Usage (from server/):
 *   node scripts/testR2.js
 *
 * Required env vars (in server/.env):
 *   R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

require('dotenv').config();
const https = require('https');
const { URL } = require('url');

const r2 = require('../services/storage/r2Client');

const redact = (v) => (v ? `${v.slice(0, 4)}…${v.slice(-4)} (len=${v.length})` : '<unset>');

function fetchUrl(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const req = https.request({
      method: 'GET',
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        body: Buffer.concat(chunks),
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

function step(name, ok, detail) {
  const tag = ok ? 'PASS' : 'FAIL';
  console.log(`  [${tag}] ${name}${detail ? ` — ${detail}` : ''}`);
  return ok;
}

(async () => {
  console.log('=== R2 smoke test ===');
  console.log(`  R2_ENDPOINT          = ${process.env.R2_ENDPOINT || '<unset>'}`);
  console.log(`  R2_ACCESS_KEY_ID     = ${redact(process.env.R2_ACCESS_KEY_ID)}`);
  console.log(`  R2_SECRET_ACCESS_KEY = ${redact(process.env.R2_SECRET_ACCESS_KEY)}`);
  console.log(`  R2_BUCKET_NAME       = ${process.env.R2_BUCKET_NAME || '<unset — falling back to default>'}`);
  console.log(`  resolved bucket      = ${r2.BUCKET_NAME}`);

  const missing = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']
    .filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`\n  Missing env vars: ${missing.join(', ')}. Aborting.`);
    process.exit(1);
  }

  const objectKey = `_smoke-test/test-${Date.now()}.txt`;
  const content = Buffer.from(`hello from trip-tracker testR2.js @ ${new Date().toISOString()}`, 'utf8');
  let allOk = true;

  // 1. upload
  try {
    const r = await r2.uploadToR2(objectKey, content, 'text/plain; charset=utf-8');
    allOk = step('upload', r.success === true && r.key === objectKey, `key=${r.key}`) && allOk;
  } catch (e) {
    step('upload', false, e.message);
    process.exit(1);
  }

  // 2. presign + download + content match
  let presignedUrl;
  try {
    presignedUrl = await r2.getPresignedUrl(objectKey, 60);
    step('presign', !!presignedUrl, `url length=${presignedUrl.length}`);
  } catch (e) {
    step('presign', false, e.message);
    allOk = false;
  }

  if (presignedUrl) {
    try {
      const { statusCode, body } = await fetchUrl(presignedUrl);
      const ok = statusCode === 200 && Buffer.compare(body, content) === 0;
      allOk = step('download via presigned URL', ok,
        `status=${statusCode}, bytes=${body.length}/${content.length}, equal=${Buffer.compare(body, content) === 0}`) && allOk;
    } catch (e) {
      step('download via presigned URL', false, e.message);
      allOk = false;
    }
  }

  // 3. exists?
  try {
    const exists = await r2.objectExists(objectKey);
    allOk = step('objectExists before delete', exists === true) && allOk;
  } catch (e) {
    step('objectExists before delete', false, e.message);
    allOk = false;
  }

  // 4. delete
  try {
    const r = await r2.deleteFromR2(objectKey);
    allOk = step('delete', r.success === true) && allOk;
  } catch (e) {
    step('delete', false, e.message);
    allOk = false;
  }

  // 5. gone?
  try {
    const exists = await r2.objectExists(objectKey);
    allOk = step('objectExists after delete', exists === false) && allOk;
  } catch (e) {
    step('objectExists after delete', false, e.message);
    allOk = false;
  }

  console.log(allOk ? '\n=== ALL CHECKS PASSED ===' : '\n=== ONE OR MORE CHECKS FAILED ===');
  process.exit(allOk ? 0 : 1);
})().catch((e) => {
  console.error('Unhandled error:', e);
  process.exit(1);
});
