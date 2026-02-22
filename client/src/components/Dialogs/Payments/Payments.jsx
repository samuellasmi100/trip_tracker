import React, { useState, useEffect } from "react";
import PaymentsView from "./Payments.view";
import PaymentIframeDialog from "./PaymentIframeDialog";
import ApiPayments from "../../../apis/paymentsRequest";
import { useSelector } from "react-redux";
import { getSocket } from "../../../utils/socketService";

const EMPTY_FORM = {
  amount: "",
  paymentMethod: "מזומן",
  paymentDate: new Date().toISOString().split("T")[0],
  notes: "",
  receipt: false,
  status: "completed",
};

/**
 * PaymentDialog — works in two modes:
 *
 *  Standalone (opened from FamilyList badge or Payments widget):
 *    <Payments open={bool} onClose={fn} family={{ family_id, family_name, total_amount }} vacationId={str} />
 *
 *  Embedded (rendered as a tab inside MainDialog — no Dialog wrapper):
 *    <Payments embedded={true} />
 *    In this mode it reads family context from Redux (userSlice.form / vacationSlice).
 */
const Payments = ({ open, onClose, family: familyProp, vacationId: vacationIdProp, embedded }) => {
  const token = sessionStorage.getItem("token");

  // Redux selectors — only used in embedded mode
  const reduxUserForm   = useSelector((state) => state.userSlice.form);
  const reduxVacationId = useSelector((state) => state.vacationSlice.vacationId);

  // Resolve family & vacationId for both modes
  const vacationId = vacationIdProp || reduxVacationId;
  const family = familyProp || {
    family_id:    reduxUserForm.family_id,
    family_name:  reduxUserForm.family_name || `${reduxUserForm.hebrew_first_name || ""} ${reduxUserForm.hebrew_last_name || ""}`.trim(),
    total_amount: reduxUserForm.total_amount || "0",
  };

  const [payments, setPayments]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);

  // Gateway / iframe state
  const [iframeOpen, setIframeOpen]         = useState(false);
  const [iframeUrl, setIframeUrl]           = useState("");
  const [iframePaymentId, setIframePaymentId] = useState(null);
  const [initLoading, setInitLoading]       = useState(false);
  const [linkLoading, setLinkLoading]       = useState(false);
  const [linkCopied, setLinkCopied]         = useState(false);

  const fetchPayments = async () => {
    if (!family?.family_id || !vacationId) return;
    setLoading(true);
    try {
      const res = await ApiPayments.getPayments(token, vacationId, family.family_id);
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Standalone mode: fetch when dialog opens; embedded mode: fetch on mount
  useEffect(() => {
    if (embedded) {
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded, family?.family_id, vacationId]);

  useEffect(() => {
    if (!embedded) {
      if (open) {
        fetchPayments();
        setForm(EMPTY_FORM);
      } else {
        setPayments([]);
        setForm(EMPTY_FORM);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, family?.family_id]);

  // Socket: refresh payments when any payment completes in this vacation
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !vacationId) return;
    const handler = (data) => {
      if (String(data.vacationId) === String(vacationId)) {
        fetchPayments();
      }
    };
    socket.on("payment_completed", handler);
    return () => socket.off("payment_completed", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacationId]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    if (!form.amount || !form.paymentDate || !form.paymentMethod) return;
    setSubmitting(true);
    try {
      await ApiPayments.addPayment(token, vacationId, {
        ...form,
        familyId: family.family_id,
      });
      await fetchPayments();
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (paymentId) => {
    try {
      await ApiPayments.deletePayment(token, vacationId, paymentId);
      await fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Gateway handlers ────────────────────────────────────────────────────────

  const handleInitSession = async () => {
    if (!family?.family_id || !vacationId) return;
    setInitLoading(true);
    try {
      const res = await ApiPayments.initPaymentSession(token, vacationId, {
        familyId: family.family_id,
        amount: remaining > 0 ? remaining : (totalAmount || 100),
        description: `תשלום - ${family.family_name}`,
      });
      setIframeUrl(res.data.url);
      setIframePaymentId(res.data.paymentId);
      setIframeOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setInitLoading(false);
    }
  };

  const handleCreateLink = async () => {
    if (!family?.family_id || !vacationId) return;
    setLinkLoading(true);
    try {
      const res = await ApiPayments.createPaymentLink(token, vacationId, {
        familyId: family.family_id,
        amount: remaining > 0 ? remaining : (totalAmount || 100),
        description: `תשלום - ${family.family_name}`,
      });
      await navigator.clipboard.writeText(res.data.url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLinkLoading(false);
    }
  };

  const handleIframeSuccess = () => {
    setIframeOpen(false);
    setIframeUrl("");
    setIframePaymentId(null);
    fetchPayments();
  };

  const totalAmount = Number(family?.total_amount || 0);
  const paidAmount  = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const remaining = totalAmount - paidAmount;

  return (
    <>
      <PaymentsView
        embedded={embedded}
        open={open}
        onClose={onClose}
        family={family}
        payments={payments}
        loading={loading}
        form={form}
        submitting={submitting}
        totalAmount={totalAmount}
        paidAmount={paidAmount}
        remaining={remaining}
        onFormChange={handleFormChange}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onInitSession={handleInitSession}
        onCreateLink={handleCreateLink}
        initLoading={initLoading}
        linkLoading={linkLoading}
        linkCopied={linkCopied}
      />

      <PaymentIframeDialog
        open={iframeOpen}
        onClose={() => { setIframeOpen(false); setIframeUrl(""); setIframePaymentId(null); }}
        url={iframeUrl}
        paymentId={iframePaymentId}
        vacationId={vacationId}
        familyId={family?.family_id}
        onSuccess={handleIframeSuccess}
      />
    </>
  );
};

export default Payments;
