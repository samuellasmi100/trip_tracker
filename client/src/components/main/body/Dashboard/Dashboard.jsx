import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import dashboardRequest from "../../../../apis/dashboardRequest";
import * as dashboardSlice from "../../../../store/slice/dashboardSlice";
import DashboardView from "./Dashboard.view";

const ZERO = {
  families:        { total: 0, totalGuests: 0 },
  payments:        { totalExpected: 0, totalPaid: 0 },
  rooms:           { total: 0, occupied: 0, withoutRoom: 0 },
  flightReadiness: { totalGuests: 0, withPassport: 0, withBirthdate: 0, withOutbound: 0, withReturn: 0, fullyReady: 0 },
  leads:           { total: 0, active: 0, registered: 0, newCold: 0, notRelevant: 0 },
  bookings:        { total: 0, submitted: 0, notSubmitted: 0 },
};

function mergeResults(results) {
  return results.reduce((acc, r) => ({
    families: {
      total:       acc.families.total       + r.families.total,
      totalGuests: acc.families.totalGuests + r.families.totalGuests,
    },
    payments: {
      totalExpected: acc.payments.totalExpected + r.payments.totalExpected,
      totalPaid:     acc.payments.totalPaid     + r.payments.totalPaid,
    },
    rooms: {
      total:       acc.rooms.total       + r.rooms.total,
      occupied:    acc.rooms.occupied    + r.rooms.occupied,
      withoutRoom: acc.rooms.withoutRoom + r.rooms.withoutRoom,
    },
    flightReadiness: {
      totalGuests:   acc.flightReadiness.totalGuests   + r.flightReadiness.totalGuests,
      withPassport:  acc.flightReadiness.withPassport  + r.flightReadiness.withPassport,
      withBirthdate: acc.flightReadiness.withBirthdate + r.flightReadiness.withBirthdate,
      withOutbound:  acc.flightReadiness.withOutbound  + r.flightReadiness.withOutbound,
      withReturn:    acc.flightReadiness.withReturn     + r.flightReadiness.withReturn,
      fullyReady:    acc.flightReadiness.fullyReady     + r.flightReadiness.fullyReady,
    },
    leads: {
      total:       acc.leads.total       + r.leads.total,
      active:      acc.leads.active      + r.leads.active,
      registered:  acc.leads.registered  + r.leads.registered,
      newCold:     acc.leads.newCold     + r.leads.newCold,
      notRelevant: acc.leads.notRelevant + r.leads.notRelevant,
    },
    bookings: {
      total:        acc.bookings.total        + r.bookings.total,
      submitted:    acc.bookings.submitted    + r.bookings.submitted,
      notSubmitted: acc.bookings.notSubmitted + r.bookings.notSubmitted,
    },
  }), { ...ZERO });
}

function Dashboard() {
  const dispatch       = useDispatch();
  const token          = useSelector((state) => state.authSlice.token);
  const vacations      = useSelector((state) => state.vacationSlice.vacations);
  const globalVacId    = useSelector((state) => state.vacationSlice.vacationId);
  const { data, loading } = useSelector((state) => state.dashboardSlice);

  const [selectedIds, setSelectedIds]     = useState(globalVacId ? [globalVacId] : []);
  const [lastUpdated, setLastUpdated]     = useState(null);
  const [crossFamilies, setCrossFamilies] = useState([]);

  const fetchSummary = useCallback(async (ids) => {
    if (!ids || ids.length === 0) return;
    dispatch(dashboardSlice.setDashboardLoading(true));
    try {
      const responses = await Promise.all(ids.map((id) => dashboardRequest.getSummary(token, id)));
      dispatch(dashboardSlice.setDashboardData(mergeResults(responses.map((r) => r.data))));
      setLastUpdated(moment().format("HH:mm:ss"));

      // Cross-vacation families only when 2+ vacations selected
      if (ids.length >= 2) {
        const crossRes = await dashboardRequest.getCrossVacation(token, ids);
        setCrossFamilies(crossRes.data.families || []);
      } else {
        setCrossFamilies([]);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      dispatch(dashboardSlice.setDashboardLoading(false));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchSummary(selectedIds);
    } else {
      dispatch(dashboardSlice.clearDashboardData());
      setCrossFamilies([]);
    }
  }, [selectedIds, fetchSummary, dispatch]);

  // Sync when header vacation selector changes
  useEffect(() => {
    if (globalVacId && !selectedIds.includes(globalVacId)) {
      setSelectedIds([globalVacId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalVacId]);

  return (
    <DashboardView
      vacations={vacations || []}
      selectedIds={selectedIds}
      onVacationChange={setSelectedIds}
      data={data}
      loading={loading}
      lastUpdated={lastUpdated}
      onRefresh={() => fetchSummary(selectedIds)}
      crossFamilies={crossFamilies}
    />
  );
}

export default Dashboard;
