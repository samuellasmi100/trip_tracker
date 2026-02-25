'use strict';

const dashboardDb = require('./dashboardDb');

const getSummary = async (vacationId) => {
  const { familyRow, roomRow, paymentRow, flightRow, leadsRow, bookingsRow } =
    await dashboardDb.getSummary(vacationId);

  const totalFamilies    = Number(familyRow?.total_families    ?? 0);
  const occupiedFamilies = Number(roomRow?.occupied_families   ?? 0);
  const roomFamilyTotal  = Number(roomRow?.total_families      ?? totalFamilies);

  const submitted    = Number(bookingsRow?.submitted ?? 0);

  return {
    families: {
      total:       totalFamilies,
      totalGuests: Number(familyRow?.total_guests ?? 0),
    },
    payments: {
      totalExpected: Number(paymentRow?.total_expected ?? 0),
      totalPaid:     Number(paymentRow?.total_paid     ?? 0),
    },
    rooms: {
      total:       Number(roomRow?.total_rooms ?? 0),
      occupied:    occupiedFamilies,
      withoutRoom: Math.max(0, roomFamilyTotal - occupiedFamilies),
    },
    flightReadiness: {
      totalGuests:  Number(flightRow?.total_guests_in_system ?? 0),
      withPassport: Number(flightRow?.with_passport  ?? 0),
      withBirthdate:Number(flightRow?.with_birthdate ?? 0),
      withOutbound: Number(flightRow?.with_outbound  ?? 0),
      withReturn:   Number(flightRow?.with_return    ?? 0),
      fullyReady:   Number(flightRow?.fully_ready    ?? 0),
    },
    leads: {
      total:       Number(leadsRow?.total       ?? 0),
      active:      Number(leadsRow?.active      ?? 0),
      registered:  Number(leadsRow?.registered  ?? 0),
      newCold:     Number(leadsRow?.new_cold    ?? 0),
      notRelevant: Number(leadsRow?.not_relevant ?? 0),
    },
    bookings: {
      total:        totalFamilies,
      submitted,
      notSubmitted: Math.max(0, totalFamilies - submitted),
    },
  };
};

const getCrossVacationFamilies = async (vacationIds) => {
  const rows = await dashboardDb.getCrossVacation(vacationIds);
  return rows.map((r) => ({
    familyName:   r.family_name,
    vacationCount: Number(r.vacation_count),
    vacationIds:  String(r.vacation_ids).split(','),
  }));
};

module.exports = { getSummary, getCrossVacationFamilies };
