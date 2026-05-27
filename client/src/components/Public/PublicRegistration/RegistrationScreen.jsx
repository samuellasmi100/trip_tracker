import React, { useState, useRef, useCallback } from "react";
import RegistrationScreenView from "./RegistrationScreen.view";
import ApiRegistrations from "../../../apis/registrationsRequest";

/**
 * Post-verify content. Owns the form state, the canvas-based signature pad,
 * and the submit call. Receives pageData + verifyToken from the shell.
 *
 * The signature pad uses the same plain-canvas pattern as PublicSignaturePage
 * (no extra library) — mouse + touch handlers, coordinate-scaled from the
 * canvas's CSS box.
 */
const RegistrationScreen = ({ vacationId, token, pageData, verifyToken, formData }) => {
  const [form, setForm] = useState({
    address: "",
    city: "",
    postal_code: "",
    general_notes: "",
  });

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [canvasEmpty, setCanvasEmpty] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onChange = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

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

  const stopDraw = useCallback(() => { isDrawing.current = false; }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasEmpty(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (canvasEmpty) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL("image/png");

    setSubmitting(true);
    setSubmitError(null);
    try {
      await ApiRegistrations.submit(vacationId, token, {
        verifyToken,
        signatureData,
        clientInputs: { ...form },
      });
      setSubmitted(true);
    } catch (e) {
      const code = e?.response?.data?.code;
      const message = e?.response?.data?.message;
      // Verify-token expiry mid-session: prompt the user to refresh.
      if (code === "VERIFY_EXPIRED" || code === "VERIFY_MISMATCH") {
        setSubmitError("פג תוקף האימות. רענן את הדף ונסה שוב.");
      } else if (code === "ALREADY_SIGNED" || code === "NOT_PENDING") {
        setSubmitError("הטופס כבר נחתם.");
      } else if (code === "EXPIRED" || code === "CANCELLED") {
        setSubmitError(message || "הקישור אינו תקף יותר.");
      } else {
        setSubmitError(message || "שליחת הטופס נכשלה, נסה שוב");
      }
    } finally {
      setSubmitting(false);
    }
  }, [canvasEmpty, vacationId, token, verifyToken, form]);

  return (
    <RegistrationScreenView
      pageData={pageData}
      formData={formData}
      form={form}
      onChange={onChange}
      canvasRef={canvasRef}
      canvasEmpty={canvasEmpty}
      startDraw={startDraw}
      draw={draw}
      stopDraw={stopDraw}
      clearCanvas={clearCanvas}
      submitting={submitting}
      submitted={submitted}
      submitError={submitError}
      handleSubmit={handleSubmit}
    />
  );
};

export default RegistrationScreen;
