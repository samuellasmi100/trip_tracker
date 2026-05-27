'use strict';

/**
 * Cloudflare R2 client (S3-compatible).
 *
 * Ported from Smart Wig (wigsBusinessApi/services/storage/r2Client.js) into
 * Trip Tracker against a dedicated bucket on a separate Cloudflare account.
 *
 * Env vars (read at import time — set in server/.env):
 *   R2_ENDPOINT           https://<account-id>.r2.cloudflarestorage.com
 *   R2_ACCESS_KEY_ID      access key from the R2 API token
 *   R2_SECRET_ACCESS_KEY  secret key from the R2 API token
 *   R2_BUCKET_NAME        defaults to 'trip-tracker-files' if unset
 *
 * The S3Client is created once and reused — region is the literal string
 * 'auto', which R2 requires.
 */

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const logger = require('../../utils/logger');

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'trip-tracker-files';

/**
 * Upload a buffer to R2.
 * @param {string} objectKey
 * @param {Buffer} buffer
 * @param {string} contentType
 * @returns {Promise<{success: true, key: string}>}
 */
const uploadToR2 = async (objectKey, buffer, contentType) => {
  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
    }));
    return { success: true, key: objectKey };
  } catch (error) {
    logger.error(`r2Client.uploadToR2 (${objectKey}): ${error.message}`);
    throw new Error(`Failed to upload to R2: ${error.message}`);
  }
};

/**
 * Generate a short-lived presigned GET URL for downloading an object.
 * @param {string} objectKey
 * @param {number} expiresIn  seconds; default 900 (15 minutes)
 * @returns {Promise<string>}
 */
const getPresignedUrl = async (objectKey, expiresIn = 900) => {
  try {
    return await getSignedUrl(
      r2Client,
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: objectKey }),
      { expiresIn }
    );
  } catch (error) {
    logger.error(`r2Client.getPresignedUrl (${objectKey}): ${error.message}`);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};

/**
 * Delete a single object.
 * @param {string} objectKey
 * @returns {Promise<{success: true}>}
 */
const deleteFromR2 = async (objectKey) => {
  try {
    await r2Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    }));
    return { success: true };
  } catch (error) {
    logger.error(`r2Client.deleteFromR2 (${objectKey}): ${error.message}`);
    throw new Error(`Failed to delete from R2: ${error.message}`);
  }
};

/**
 * Delete every object under a prefix (paginated).
 * Useful for "remove a family's entire folder" cleanup paths.
 * @param {string} prefix
 * @returns {Promise<{success: true, deletedCount: number}>}
 */
const deleteByPrefix = async (prefix) => {
  try {
    let deletedCount = 0;
    let continuationToken;

    do {
      const listResponse = await r2Client.send(new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }));

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        for (const obj of listResponse.Contents) {
          await deleteFromR2(obj.Key);
          deletedCount += 1;
        }
      }
      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    return { success: true, deletedCount };
  } catch (error) {
    logger.error(`r2Client.deleteByPrefix (${prefix}): ${error.message}`);
    throw new Error(`Failed to delete by prefix from R2: ${error.message}`);
  }
};

/**
 * Existence check without downloading the body. Returns false on NoSuchKey;
 * any other error propagates.
 * @param {string} objectKey
 * @returns {Promise<boolean>}
 */
const objectExists = async (objectKey) => {
  try {
    await r2Client.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    }));
    return true;
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.Code === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
};

/**
 * Fetch an object into a Buffer.
 * @param {string} objectKey
 * @returns {Promise<Buffer>}
 */
const getObjectBuffer = async (objectKey) => {
  try {
    const response = await r2Client.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    }));
    const chunks = [];
    for await (const chunk of response.Body) chunks.push(chunk);
    return Buffer.concat(chunks);
  } catch (error) {
    logger.error(`r2Client.getObjectBuffer (${objectKey}): ${error.message}`);
    throw new Error(`Failed to get object from R2: ${error.message}`);
  }
};

module.exports = {
  uploadToR2,
  getPresignedUrl,
  deleteFromR2,
  deleteByPrefix,
  objectExists,
  getObjectBuffer,
  BUCKET_NAME,
};
