'use strict';

const db = require('../../db/connection-wrapper');
const q  = require('../../sql/query/dashboardQuery');

const getSummary = async (vacationId) => {
  // Use allSettled so a missing table (e.g. leads on old vacation, or no
  // vacation_date rows) doesn't crash the whole request
  const [familyRes, roomRes, roomWeekRes, roomOverallRes, paymentRes, flightRes, leadsRes] =
    await Promise.allSettled([
      db.execute(q.getFamiliesAndGuests(vacationId)),
      db.execute(q.getRoomOccupancy(vacationId)),
      db.execute(q.getRoomUtilizationByWeek(vacationId)),
      db.execute(q.getOverallRoomUtilization(vacationId)),
      db.execute(q.getPaymentSummary(vacationId)),
      db.execute(q.getFlightReadiness(vacationId)),
      db.execute(q.getLeadsSummary(vacationId)),
    ]);

  const val  = (res) => (res.status === 'fulfilled' ? res.value[0] : null);
  // Per-week query returns many rows — keep the whole array, not just the first.
  const rows = (res) => (res.status === 'fulfilled' ? res.value : []);

  return {
    familyRow:      val(familyRes),
    roomRow:        val(roomRes),
    roomWeekRows:   rows(roomWeekRes),
    roomOverallRow: val(roomOverallRes),
    paymentRow:     val(paymentRes),
    flightRow:      val(flightRes),
    leadsRow:       val(leadsRes),
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
