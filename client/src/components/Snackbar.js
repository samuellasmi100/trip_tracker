import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as snackbarSlice from "../store/slice/snackbarSlice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

const typeConfig = {
  success: {
    icon: CheckCircleOutlineIcon,
    bg: "#f0fdf4",
    border: "#bbf7d0",
    color: "#15803d",
    iconColor: "#22c55e",
    progressColor: "#22c55e",
  },
  error: {
    icon: ErrorOutlineIcon,
    bg: "#fef2f2",
    border: "#fecaca",
    color: "#b91c1c",
    iconColor: "#ef4444",
    progressColor: "#ef4444",
  },
  warn: {
    icon: WarningAmberIcon,
    bg: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
    iconColor: "#f59e0b",
    progressColor: "#f59e0b",
  },
  info: {
    icon: InfoOutlinedIcon,
    bg: "#f0fdfa",
    border: "#99f6e4",
    color: "#0f766e",
    iconColor: "#0d9488",
    progressColor: "#0d9488",
  },
};

let toastCounter = 0;

export default function SnackBar() {
  const dispatch = useDispatch();
  const { timeout, message, type, toastId, position } = useSelector(
    (state) => state?.snackBarSlice
  );
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  useEffect(() => {
    if (message !== "") {
      const id = toastId || `toast-${++toastCounter}`;

      // Prevent duplicate toasts with same toastId
      setToasts((prev) => {
        if (toastId && prev.some((t) => t.toastId === toastId && !t.exiting)) {
          return prev;
        }
        return [
          ...prev,
          {
            id,
            toastId,
            message,
            type: type || "success",
            timeout: timeout || 3000,
            exiting: false,
            createdAt: Date.now(),
          },
        ];
      });

      dispatch(snackbarSlice.disableSnackBar());
    }
  }, [message]);

  // Auto-dismiss
  useEffect(() => {
    const timers = toasts
      .filter((t) => !t.exiting)
      .map((t) => {
        const elapsed = Date.now() - t.createdAt;
        const remaining = Math.max(t.timeout - elapsed, 0);
        return setTimeout(() => removeToast(t.id), remaining);
      });
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  const positionStyle = position === "top-left"
    ? { left: "24px" }
    : { right: "24px" };

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        ...positionStyle,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
        direction: "rtl",
      }}
    >
      {toasts.map((t) => {
        const config = typeConfig[t.type] || typeConfig.info;
        const Icon = config.icon;
        const progress = Math.max(0, (Date.now() - t.createdAt) / t.timeout);

        return (
          <ToastItem
            key={t.id}
            toast={t}
            config={config}
            Icon={Icon}
            onClose={() => removeToast(t.id)}
          />
        );
      })}
    </div>
  );
}

function ToastItem({ toast, config, Icon, onClose }) {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - toast.createdAt;
      setProgress(Math.min(elapsed / toast.timeout, 1));
    }, 30);
    return () => clearInterval(interval);
  }, [toast.createdAt, toast.timeout, hovered]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: "300px",
        maxWidth: "420px",
        padding: "14px 16px",
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
        fontFamily: "inherit",
        position: "relative",
        overflow: "hidden",
        animation: toast.exiting
          ? "snackbarSlideOut 300ms ease-in forwards"
          : "snackbarSlideIn 300ms ease-out",
      }}
    >
      {/* Icon */}
      <Icon style={{ fontSize: "22px", color: config.iconColor, flexShrink: 0 }} />

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: "13px",
          fontWeight: 500,
          color: config.color,
          lineHeight: 1.4,
        }}
      >
        {toast.message}
      </span>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          flexShrink: 0,
          opacity: 0.5,
          transition: "opacity 150ms",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
      >
        <CloseIcon style={{ fontSize: "16px", color: config.color }} />
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          height: "3px",
          backgroundColor: `${config.progressColor}20`,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(1 - progress) * 100}%`,
            backgroundColor: config.progressColor,
            borderRadius: "0 0 12px 12px",
            transition: hovered ? "none" : "width 50ms linear",
          }}
        />
      </div>

      {/* Keyframe animation styles */}
      <style>{`
        @keyframes snackbarSlideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes snackbarSlideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(30px);
          }
        }
      `}</style>
    </div>
  );
}
