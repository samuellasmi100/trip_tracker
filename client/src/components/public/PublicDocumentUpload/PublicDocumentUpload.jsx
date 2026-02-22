import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PublicDocumentUploadView from "./PublicDocumentUpload.view";
import ApiDocuments from "../../../apis/documentsRequest";

const PublicDocumentUpload = () => {
  const { vacationId, docToken } = useParams();

  const [pageData, setPageData] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(null); // key being uploaded

  const fetchPage = async () => {
    try {
      const res = await ApiDocuments.getPublicPage(vacationId, docToken);
      setPageData(res.data);
      setUploadedDocs(res.data.uploadedDocs || []);
    } catch (err) {
      setError("קישור לא תקין או שפג תוקפו");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [vacationId, docToken]);

  const handleUpload = async (userId, docTypeId, file, key) => {
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("doc_type_id", docTypeId);

      await ApiDocuments.uploadPublic(vacationId, docToken, formData);

      // Optimistic update — add a fake record so the card turns green immediately
      setUploadedDocs((prev) => [
        ...prev,
        { user_id: userId, doc_type_id: docTypeId, file_name: file.name, id: Date.now() },
      ]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px", color: "#64748b", fontFamily: "sans-serif" }}>
        טוען...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px", color: "#ef4444", fontFamily: "sans-serif" }}>
        {error}
      </div>
    );
  }

  return (
    <PublicDocumentUploadView
      family={pageData?.family}
      members={pageData?.members || []}
      docTypes={pageData?.docTypes || []}
      uploadedDocs={uploadedDocs}
      uploading={uploading}
      onUpload={handleUpload}
      allDone={false}
    />
  );
};

export default PublicDocumentUpload;
