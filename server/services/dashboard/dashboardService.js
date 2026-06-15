'use strict';

const dashboardDb = require('./dashboardDb');

const getSummary = async (vacationId) => {
  const { familyRow, roomRow, roomWeekRows, roomOverallRow, paymentRow, flightRow, leadsRow } =
    await dashboardDb.getSummary(vacationId);

  const totalFamilies    = Number(familyRow?.total_families    ?? 0);
  const occupiedFamilies = Number(roomRow?.occupied_families   ?? 0);
  const roomFamilyTotal  = Number(roomRow?.total_families      ?? totalFamilies);

  // Corrected room-occupancy figures (room ÷ room). The total room count is the
  // constant denominator shared by the overall figure and every week. Fall back
  // to the legacy roomRow total if the overall query was rejected.
  const roomTotal        = Number(roomOverallRow?.total_rooms    ?? roomRow?.total_rooms ?? 0);
  const occupiedRooms    = Number(roomOverallRow?.occupied_rooms ?? 0);
  const pct = (occupied, total) => (total > 0 ? Math.round((occupied / total) * 100) : 0);

  const roomsByWeek = (roomWeekRows ?? []).map((w) => {
    const occupied = Number(w.occupied_rooms ?? 0);
    return {
      weekId:        w.week_id,
      name:          w.week_name,
      startDate:     w.start_date,
      endDate:       w.end_date,
      totalRooms:    roomTotal,
      occupiedRooms: occupied,
      percentage:    pct(occupied, roomTotal),
    };
  });

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
      // Legacy global, families-based fields — kept for backward compatibility.
      // The current dashboard client (Dashboard.jsx mergeResults) sums
      // total/occupied/withoutRoom across vacations, so these must stay.
      total:       Number(roomRow?.total_rooms ?? 0),
      occupied:    occupiedFamilies,
      withoutRoom: Math.max(0, roomFamilyTotal - occupiedFamilies),
      // Corrected occupancy (room ÷ room). `overall` is the whole vacation;
      // `byWeek` is one entry per route, ordered chronologically.
      overall: {
        totalRooms:    roomTotal,
        occupiedRooms: occupiedRooms,
        percentage:    pct(occupiedRooms, roomTotal),
      },
      byWeek: roomsByWeek,
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
      total:           Number(leadsRow?.total            ?? 0),
      active:          Number(leadsRow?.active           ?? 0),
      registered:      Number(leadsRow?.registered       ?? 0),
      newCold:         Number(leadsRow?.new_cold         ?? 0),
      notRelevant:     Number(leadsRow?.not_relevant     ?? 0),
      followupOverdue: Number(leadsRow?.followup_overdue ?? 0),
      followupToday:   Number(leadsRow?.followup_today   ?? 0),
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
