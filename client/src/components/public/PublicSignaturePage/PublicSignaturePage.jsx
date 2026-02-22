import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import PublicSignaturePageView from "./PublicSignaturePage.view";
import ApiSignatures from "../../../apis/signaturesRequest";

const PublicSignaturePage = () => {
  const { vacationId, docToken } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signerName, setSignerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [canvasEmpty, setCanvasEmpty] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await ApiSignatures.getPublicPage(vacationId, docToken);
        setPageData(res.data);
      } catch (e) {
        setError("קישור לא תקין או שפג תוקפו");
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [vacationId, docToken]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    isDrawing.current = true;
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setCanvasEmpty(false);
  }, []);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasEmpty(true);
  }, []);

  const handleSubmit = async () => {
    if (!signerName.trim() || canvasEmpty) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL("image/png");
    setSubmitting(true);
    try {
      await ApiSignatures.submitSignature(vacationId, docToken, {
        signerName: signerName.trim(),
        signatureData,
      });
      setSubmitted(true);
    } catch (e) {
      setError("שגיאה בשליחת החתימה. נא לנסות שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicSignaturePageView
      pageData={pageData}
      loading={loading}
      error={error}
      signerName={signerName}
      setSignerName={setSignerName}
      submitting={submitting}
      submitted={submitted}
      canvasRef={canvasRef}
      canvasEmpty={canvasEmpty}
      startDraw={startDraw}
      draw={draw}
      stopDraw={stopDraw}
      clearCanvas={clearCanvas}
      handleSubmit={handleSubmit}
    />
  );
};

export default PublicSignaturePage;
