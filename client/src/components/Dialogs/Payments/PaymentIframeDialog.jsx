import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getSocket } from "../../../utils/socketService";
import ApiPayments from "../../../apis/paymentsRequest";

/**
 * PaymentIframeDialog
 *
 * Props:
 *   open        — boolean
 *   onClose     — fn
 *   url         — Cardcom payment URL to load in iframe
 *   paymentId   — DB payment row id (for polling + socket match)
 *   vacationId  — vacation scope
 *   familyId    — for display purposes
 *   onSuccess   — fn called when payment completes
 */
const PaymentIframeDialog = ({ open, onClose, url, paymentId, vacationId, onSuccess }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const pollingRef = useRef(null);
  const token = sessionStorage.getItem("token");

  // Reset iframe loaded state when dialog opens
  useEffect(() => {
    if (open) {
      setIframeLoaded(false);
    }
  }, [open, url]);

  // Socket listener + polling fallback
  useEffect(() => {
    if (!open || !paymentId || !vacationId) return;

    // Socket: listen for payment_completed from server (triggered by Cardcom webhook)
    const socket = getSocket();
    const handlePaymentCompleted = (data) => {
      if (
        String(data.paymentId) === String(paymentId) ||
        String(data.vacationId) === String(vacationId)
      ) {
        clearInterval(pollingRef.current);
        onSuccess?.();
      }
    };
    socket?.on("payment_completed", handlePaymentCompleted);

    // Polling fallback: check every 5 seconds
    pollingRef.current = setInterval(async () => {
      try {
        const res = await ApiPayments.verifyPayment(token, vacationId, paymentId);
        if (res.data?.status === "completed") {
          clearInterval(pollingRef.current);
          socket?.off("payment_completed", handlePaymentCompleted);
          onSuccess?.();
        }
      } catch {
        // ignore transient errors
      }
    }, 5000);

    return () => {
      socket?.off("payment_completed", handlePaymentCompleted);
      clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paymentId, vacationId]);

  const handleClose = () => {
    clearInterval(pollingRef.current);
    setIframeLoaded(false);
    onClose?.();
  };

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      style={{ zIndex: 1700 }}
      PaperProps={{ style: { borderRadius: "14px", overflow: "hidden" } }}
    >
      <DialogTitle
        disableTypography
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
        }}
      >
        <Typography style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
          תשלום בכרטיס אשראי
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          style={{
            color: "#ffffff",
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: "4px",
          }}
        >
          <CloseIcon style={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ padding: 0, minHeight: "520px", position: "relative" }}>
        {/* Loading spinner until iframe loads */}
        {!iframeLoaded && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              zIndex: 1,
            }}
          >
            <CircularProgress style={{ color: "#0d9488" }} />
            <Typography style={{ fontSize: "13px", color: "#94a3b8" }}>
              טוען טופס תשלום...
            </Typography>
          </div>
        )}

        {url && (
          <iframe
            src={url}
            title="Cardcom Payment"
            style={{
              width: "100%",
              height: "520px",
              border: "none",
              display: "block",
            }}
            onLoad={() => setIframeLoaded(true)}
            sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation allow-popups"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentIframeDialog;
