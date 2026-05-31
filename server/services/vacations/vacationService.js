const vacationDb = require("./vacationDb")

const addVacation = async (vacationDetails,vacationId) => {
    const dateEntries = [];
    Object.keys(vacationDetails).forEach((key) => {
      if (key.startsWith("start_date")) {
        const index = key.split("_")[2]; 
        const start_date = vacationDetails[`start_date_${index}`];
        const end_date = vacationDetails[`end_date_${index}`];
    
        dateEntries.push({
          vacation_id:vacationId,
          start_date,
          end_date,
          name: `שבוע ${parseInt(index, 10) + 1}`,
        });
      }
    });
    if (vacationDetails.exceptions === "on") {
      dateEntries.push({
        vacation_id:vacationId,
        start_date: "",
        end_date: "",
        name: "חריגים",
      });
    }

     await vacationDb.addVacation(vacationDetails,vacationId)
     await Promise.all(dateEntries?.map((vac) => vacationDb.addVacationDates(vacationId,vac.start_date,vac.end_date,vac.name)));
}

const getVacations = async () => {
    return await vacationDb.getVacations()
}
const getVacationDates = async (vacationId) => {
  return await vacationDb.getVacationDates(vacationId)
}
const getAllVacationDates = async () => {
  return await vacationDb.getAllVacationDates()
}

// A part has no foreign key, and its linked guest/family rows live in a separate
// database (trip_tracker_<id>), so the DB can neither block nor cascade a delete.
// We answer "is this part still in use?" at the application level, mirroring the
// two ways the app links a part: the part NAME copied into guest.week_chosen, and
// the part date range copied into families.start_date/end_date. Returns the
// blocking families/guests BY NAME so the UI can tell the user who to reassign.
const getPartUsage = async (id) => {
  const partRows = await vacationDb.getVacationPartById(id)
  const part = partRows && partRows[0]
  if (!part) return null

  const guestRows = await vacationDb.getGuestsOnPart(part.vacation_id, part.name)
  const guests = (guestRows || [])
    .map((g) => `${g.hebrew_first_name || ""} ${g.hebrew_last_name || ""}`.trim())
    .filter((name) => name !== "")

  // Only match families by date when the part actually has a range. An empty-date
  // part (e.g. "חריגים") would otherwise match every family that also has blank
  // dates; such a part is linked only by name, which the guest check above covers.
  let families = []
  if (part.start_date && part.end_date) {
    const familyRows = await vacationDb.getFamiliesOnPartDates(part.vacation_id, part.start_date, part.end_date)
    families = (familyRows || []).map((f) => f.family_name)
  }

  return {
    part,
    families,
    guests,
    inUse: families.length > 0 || guests.length > 0,
  }
}

// Guarded delete: only an EMPTY part may be removed. If anything is still linked,
// block and return the blockers; the server enforces this regardless of the client.
const deleteVacationPart = async (id) => {
  const usage = await getPartUsage(id)
  if (!usage) {
    return { deleted: false, notFound: true }
  }
  if (usage.inUse) {
    return { deleted: false, blockers: { families: usage.families, guests: usage.guests } }
  }
  await vacationDb.deleteVacationPart(id)
  return { deleted: true }
}

// Update an EXISTING vacation in place, by its existing vacation_id — never
// generates a new id and never creates a tenant DB (that was the duplicate bug).
// Reconciliation rules are chosen to preserve the part-deletion guarantees:
//   - existing parts (have id) are UPDATED in place; their NAME is left untouched,
//     so a part families are already assigned to ("שבוע 3") never renumbers.
//   - genuinely new parts (no id) are INSERTed with a fresh "שבוע N" name, one
//     past the highest existing week number, so they never collide with — or
//     renumber — existing parts, even if a middle part was previously deleted.
//   - removal is intentionally NOT handled here. Parts are removed only through
//     the guarded delete endpoint, so an update can never silently drop an
//     in-use part.
//   - exceptions is additive: add a "חריגים" part only if requested and missing.
// Returns the fresh part rows (incl. ids for newly inserted parts) so the client
// can update its state without a manual refresh.
const updateVacation = async (payload, vacationId) => {
  await vacationDb.updateVacation(vacationId, payload.vacation_name)

  const existing = (await vacationDb.getVacationDates(vacationId)) || []
  const existingIds = new Set(existing.map((r) => r.id))

  let maxWeek = 0
  existing.forEach((r) => {
    const m = typeof r.name === "string" && r.name.match(/^שבוע\s+(\d+)$/)
    if (m) maxWeek = Math.max(maxWeek, parseInt(m[1], 10))
  })

  const parts = Array.isArray(payload.parts) ? payload.parts : []
  for (const p of parts) {
    const startDate = p.start_date || ""
    const endDate = p.end_date || ""
    if (p.id && existingIds.has(p.id)) {
      await vacationDb.updateVacationDate(p.id, startDate, endDate)
    } else {
      maxWeek += 1
      await vacationDb.addVacationDates(vacationId, startDate, endDate, `שבוע ${maxWeek}`)
    }
  }

  if (payload.exceptions && !existing.some((r) => r.name === "חריגים")) {
    await vacationDb.addVacationDates(vacationId, "", "", "חריגים")
  }

  return await vacationDb.getVacationDates(vacationId)
}

module.exports = {
    addVacation,
    getVacations,
    getVacationDates,
    getAllVacationDates,
    getPartUsage,
    deleteVacationPart,
    updateVacation
}