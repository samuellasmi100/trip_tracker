import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

const RoomRoster = ({ boardData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { rooms, bookings, guestAssignments } = boardData;

  // Build: roomId → { room, familyName, guests[] }
  const rosterRows = useMemo(() => {
    const rowMap = {};
    guestAssignments.forEach((a) => {
      if (!rowMap[a.room_id]) {
        const booking = bookings.find(
          (b) => b.room_id === a.room_id && b.family_id === a.family_id
        );
        const room = rooms.find((r) => r.rooms_id === a.room_id);
        rowMap[a.room_id] = {
          room,
          familyName: booking?.family_name || "",
          guests: [],
        };
      }
      rowMap[a.room_id].guests.push({
        firstName: a.hebrew_first_name,
        lastName: a.hebrew_last_name,
        fullName: `${a.hebrew_first_name} ${a.hebrew_last_name}`,
      });
    });
    return Object.values(rowMap)
      .filter((row) => row.room)
      .sort((a, b) =>
        String(a.room.rooms_id).localeCompare(String(b.room.rooms_id), undefined, { numeric: true })
      );
  }, [rooms, bookings, guestAssignments]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return rosterRows;
    return rosterRows.filter(
      (row) =>
        row.guests.some(
          (g) =>
            g.firstName.includes(term) ||
            g.lastName.includes(term) ||
            g.fullName.includes(term)
        ) || row.familyName.includes(term)
    );
  }, [rosterRows, searchTerm]);

  // If search matched exactly one room, highlight the matching guest
  const matchedGuestName = searchTerm.trim();

  const totalGuests = filteredRows.reduce((sum, row) => sum + row.guests.length, 0);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    const tableRows = filteredRows
      .map(
        (row) => `
        <tr>
          <td>${row.room.rooms_id}</td>
          <td>${row.room.floor ? `ק${row.room.floor}` : "—"}</td>
          <td>${row.familyName}</td>
          <td>${row.guests.map((g) => g.fullName).join("<br/>")}</td>
        </tr>`
      )
      .join("");
    win.document.write(`
      <html dir="rtl">
        <head>
          <title>שיבוץ חדרים</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
            h2 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: right; vertical-align: top; }
            th { background: #f0f0f0; font-weight: bold; }
            tr:nth-child(even) { background: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>שיבוץ חדרים לצ'ק-אין</h2>
          <table>
            <thead><tr><th>חדר</th><th>קומה</th><th>משפחה</th><th>אורחים</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handleExportExcel = () => {
    const data = [];
    filteredRows.forEach((row) => {
      row.guests.forEach((g, i) => {
        data.push({
          חדר: i === 0 ? row.room.rooms_id : "",
          קומה: i === 0 ? (row.room.floor || "") : "",
          משפחה: i === 0 ? row.familyName : "",
          "שם פרטי": g.firstName,
          "שם משפחה": g.lastName,
          "שם מלא": g.fullName,
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "שיבוץ חדרים");
    XLSX.writeFile(wb, "שיבוץ-חדרים.xlsx");
  };

  return (
    <Box sx={{ p: 2, direction: "rtl" }}>
      {/* ── Toolbar ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="חפש לפי שם אורח או שם משפחה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2" sx={{ color: "#64748b", flexGrow: 1 }}>
          {filteredRows.length} חדרים מאוכלסים • {totalGuests} אורחים
        </Typography>
        <Button
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          variant="outlined"
          size="small"
          sx={{ textTransform: "none" }}
        >
          הדפס
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleExportExcel}
          variant="outlined"
          size="small"
          color="success"
          sx={{ textTransform: "none" }}
        >
          ייצא Excel
        </Button>
      </Box>

      {/* ── Roster table ── */}
      {filteredRows.length === 0 ? (
        <Typography sx={{ color: "#94a3b8", textAlign: "center", mt: 6 }}>
          {guestAssignments.length === 0
            ? "אין שיבוצים עדיין. שבץ אורחים לחדרים דרך לוח החדרים."
            : "לא נמצאו תוצאות לחיפוש."}
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", maxHeight: "calc(100vh - 220px)", overflow: "auto" }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc", width: 70 }}>
                  חדר
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc", width: 60 }}>
                  קומה
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc", width: 130 }}>
                  משפחה
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>
                  אורחים
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.room.rooms_id} hover>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
                    {row.room.rooms_id}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: "#64748b" }}>
                    {row.room.floor ? `ק${row.room.floor}` : "—"}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>
                    {row.familyName}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, py: 0.5 }}>
                      {row.guests.map((g, i) => {
                        const isMatch =
                          matchedGuestName &&
                          (g.firstName.includes(matchedGuestName) ||
                            g.lastName.includes(matchedGuestName) ||
                            g.fullName.includes(matchedGuestName));
                        return (
                          <Chip
                            key={i}
                            label={g.fullName}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              height: "24px",
                              backgroundColor: isMatch ? "#fef3c7" : "#f1f5f9",
                              color: isMatch ? "#92400e" : "#334155",
                              fontWeight: isMatch ? 700 : 400,
                              border: isMatch ? "1px solid #fcd34d" : "none",
                            }}
                          />
                        );
                      })}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RoomRoster;
