import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PublicBookingFormView from "./PublicBookingForm.view";
import ApiBookings from "../../../apis/bookingsRequest";

const EMPTY_GUEST = () => ({
  fullNameHe: "",
  fullNameEn: "",
  passportNumber: "",
  passportExpiry: "",
  dateOfBirth: "",
  gender: "",
  foodPreference: "",
});

const PublicBookingForm = () => {
  const { vacationId, docToken } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [paymentPreference, setPaymentPreference] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [guests, setGuests] = useState([EMPTY_GUEST()]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await ApiBookings.getPublicPage(vacationId, docToken);
        setPageData(res.data);
      } catch (e) {
        setError("קישור לא תקין או שפג תוקפו");
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [vacationId, docToken]);

  const handleGuestChange = useCallback((index, field, value) => {
    setGuests((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addGuest = useCallback(() => {
    setGuests((prev) => [...prev, EMPTY_GUEST()]);
  }, []);

  const removeGuest = useCallback((index) => {
    setGuests((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async () => {
    if (!contactName.trim()) return;
    setSubmitting(true);
    try {
      await ApiBookings.submitBooking(vacationId, docToken, {
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        contactAddress: contactAddress.trim(),
        paymentPreference,
        specialRequests: specialRequests.trim(),
        guests: guests.filter((g) => g.fullNameHe.trim() || g.fullNameEn.trim() || g.passportNumber.trim()),
      });
      setSubmitted(true);
    } catch (e) {
      const msg = e?.response?.data?.message;
      setError(msg || "שגיאה בשליחת הטופס. נא לנסות שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicBookingFormView
      pageData={pageData}
      loading={loading}
      error={error}
      submitting={submitting}
      submitted={submitted}
      contactName={contactName}
      setContactName={setContactName}
      contactPhone={contactPhone}
      setContactPhone={setContactPhone}
      contactEmail={contactEmail}
      setContactEmail={setContactEmail}
      contactAddress={contactAddress}
      setContactAddress={setContactAddress}
      paymentPreference={paymentPreference}
      setPaymentPreference={setPaymentPreference}
      specialRequests={specialRequests}
      setSpecialRequests={setSpecialRequests}
      guests={guests}
      handleGuestChange={handleGuestChange}
      addGuest={addGuest}
      removeGuest={removeGuest}
      handleSubmit={handleSubmit}
    />
  );
};

export default PublicBookingForm;
