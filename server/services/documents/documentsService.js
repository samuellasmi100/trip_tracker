'use strict';

const fs = require('fs');
const db = require('./documentsDb');
const r2 = require('../storage/r2Client');

// Doc types whose file_path is an R2 object key (not a local filesystem
// path). For these, downloads go through R2 presigned URLs.
const R2_BACKED_TYPE_KEYS = new Set(['signed_registration']);

/**
 * Verifies token → returns page data for the public upload form.
 * Returns null if token is invalid.
 */
const getPublicUploadPage = async (vacationId, docToken) => {
  const family = await db.getFamilyByToken(vacationId, docToken);
  if (!family) return null;

  const [members, docTypes, uploadedDocs] = await Promise.all([
    db.getFamilyMembers(vacationId, family.family_id),
    db.getDocumentTypes(vacationId),
    db.getDocsByFamily(vacationId, family.family_id),
  ]);

  return { family, members, docTypes, uploadedDocs };
};

/**
 * Inserts a document record into the DB after multer has saved the file.
 */
const uploadDocument = async (vacationId, { family_id, user_id, doc_type_id, file_name, file_path }) => {
  return db.insertDocument(vacationId, { family_id, user_id, doc_type_id, file_name, file_path });
};

/**
 * Deletes a document record + physical file.
 */
const deleteDocument = async (vacationId, docId) => {
  const doc = await db.getDocById(vacationId, docId);
  if (!doc) return;

  // Remove physical file if it exists
  if (doc.file_path && fs.existsSync(doc.file_path)) {
    fs.unlinkSync(doc.file_path);
  }

  await db.deleteDocument(vacationId, docId);
};

const getAllFamiliesStatus = async (vacationId) => {
  return db.getAllFamiliesDocStatus(vacationId);
};

const getFamilyDocuments = async (vacationId, familyId) => {
  return db.getDocsByFamily(vacationId, familyId);
};

const addDocumentType = async (vacationId, data) => {
  // Auto-derive type_key from label (slug) if not provided
  const type_key = data.type_key || data.label
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05ff]+/g, '_')
    .replace(/^_|_$/g, '')
    || `custom_${Date.now()}`;

  const existing = await db.getDocumentTypes(vacationId);
  const sort_order = existing.length + 1;

  return db.addDocumentType(vacationId, { type_key, label: data.label, sort_order });
};

const deleteDocumentType = async (vacationId, typeId) => {
  return db.deleteDocumentType(vacationId, typeId);
};

const getFamilyLink = async (vacationId, familyId) => {
  return db.getFamilyDocToken(vacationId, familyId);
};

/**
 * Resolve a download URL for a family_documents row.
 *
 * Signed registrations are stored on R2 (file_path = R2 object key) and get a
 * presigned GET URL. Default expiry is 15 minutes for direct download (the
 * coordinator clicking the download icon). Pass `{ expiresIn: 7*24*60*60 }`
 * for the "share" flow where the coordinator forwards the URL via WhatsApp/
 * email — 7 days is the AWS S3 / R2 max for presigned URLs.
 *
 * Other doc types are uploaded by multer to local disk and aren't downloadable
 * from this endpoint (those are served via the /uploads static mount).
 */
const getDownloadInfo = async (vacationId, docId, { expiresIn = 900 } = {}) => {
  const doc = await db.getDocByIdWithType(vacationId, docId);
  if (!doc) return { code: 'NOT_FOUND' };
  if (!R2_BACKED_TYPE_KEYS.has(doc.type_key)) {
    return { code: 'NOT_DOWNLOADABLE_VIA_API' };
  }
  const url = await r2.getPresignedUrl(doc.file_path, expiresIn);
  return { ok: true, url, fileName: doc.file_name };
};

module.exports = {
  getPublicUploadPage,
  uploadDocument,
  deleteDocument,
  getAllFamiliesStatus,
  getFamilyDocuments,
  addDocumentType,
  deleteDocumentType,
  getFamilyLink,
  getDownloadInfo,
};
