'use strict';

const db = require('../../db/connection-wrapper');
const q  = require('../../sql/query/dashboardQuery');

const getSummary = async (vacationId) => {
  // Use allSettled so a missing table (e.g. leads on old vacation) doesn't crash the whole request
  const [familyRes, roomRes, paymentRes, flightRes, leadsRes] =
    await Promise.allSettled([
      db.execute(q.getFamiliesAndGuests(vacationId)),
      db.execute(q.getRoomOccupancy(vacationId)),
      db.execute(q.getPaymentSummary(vacationId)),
      db.execute(q.getFlightReadiness(vacationId)),
      db.execute(q.getLeadsSummary(vacationId)),
    ]);

  const val = (res) => (res.status === 'fulfilled' ? res.value[0] : null);

  return {
    familyRow:   val(familyRes),
    roomRow:     val(roomRes),
    paymentRow:  val(paymentRes),
    flightRow:   val(flightRes),
    leadsRow:    val(leadsRes),
  };
};

const getCrossVacation = async (vacationIds) => {
  if (vacationIds.length < 2) return [];
  try {
    return await db.execute(q.getCrossVacationFamilies(vacationIds));
  } catch {
    return [];
  }
};

module.exports = { getSummary, getCrossVacation };
