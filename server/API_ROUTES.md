# API Routes Documentation

> Base URL: `http://localhost:4000` (configurable via `REST_API_PORT` env var)

All routes except `/auth/login` require JWT Bearer token in `Authorization` header.

---

## Authentication — `/auth`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/auth/login` | Body: `{email, password}` | Login. Returns JWT token + user data. No auth required. |

**Controller:** `services/auth/authController.js`

---

## Vacations — `/vacations`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/vacations` | Body: `{vacation_name}` | Create a new vacation. Generates UUID, creates per-vacation database with all tables and seed data. |
| PUT | `/vacations` | — | Stub (empty handler, not implemented) |
| GET | `/vacations/:id` | `id` = vacationId | Get all vacations list, date ranges for this vacation, and all vacation dates. Returns `{vacations, vacationsDate, allVacationDates}`. |

**Controller:** `services/vacation/vacationController.js`

---

## Families — `/family`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/family/:id` | `id` = vacationId; Body: `{form, newFamilyId}` | Create a new family. `form` should include `family_name` or `hebrew_first_name` + `hebrew_last_name`. |
| GET | `/family/:id` | `id` = vacationId | Get all families with payment summary and guest counts. Complex query with CTE for paid amounts. |
| GET | `/family/details/:id/:familyId` | `id` = userId, `familyId` = familyId | Get full user details (personal info, flights, rooms, notes, payments). |

**Controller:** `services/family/familyController.js`

---

## Users/Guests — `/user`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/user/:id` | `id` = vacationId; Body: `{form, newFamilyId, newUserId}` | Add a guest. Sets `is_main_user` and `user_type` based on `form.userType` ("addParent"/"addFamily" → parent, else → client). |
| GET | `/user/:id/:vacationId` | `id` = familyId, `vacationId` | Get all guests in a family (with room assignments). |
| PUT | `/user/:id` | `id` = vacationId; Body: guest data object | Update guest info. Also updates room_taken dates if arrival/departure changed. Returns updated family members. |
| GET | `/user/details/:id/:familyId/:isIngroup/:vacationId` | All URL params | Get comprehensive user details: personal info, flights, room assignment, notes, payment history. |
| DELETE | `/user/:id/:vacationId` | `id` = userId | Delete a single guest + their flights, room assignments, and notes. Returns updated guest lists. |
| DELETE | `/user/main/:id/:vacationId` | `id` = familyId | Delete an entire family (all guests, flights, rooms, room_taken, notes, payments, family record). Returns updated guest lists. |

**Controller:** `services/user/userController.js`

---

## Rooms — `/rooms`

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/rooms/:vacationId` | `vacationId` | Get all rooms with family assignments and people counts. |
| GET | `/rooms/:vacationId/:startDate/:endDate` | `vacationId`, `startDate`, `endDate` | Get available rooms for a date range (rooms not booked during that period). |
| GET | `/rooms/room_available/:id/:startDate/:endDate` | `id` = vacationId, `startDate`, `endDate` | Get unavailable date ranges for all rooms (for calendar display). |
| GET | `/rooms/count` | — | Get room details with people counts (uses default DB, likely broken without vacationId). |
| POST | `/rooms` | — | Stub (empty handler, not implemented) |
| PUT | `/rooms/:id` | `id` = vacationId; Body: `{form}` | Update room details (type, floor, size, etc.). Returns updated room list. |

**Controller:** `services/rooms/roomsController.js`

---

## User Room Assignments — `/user_rooms`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/user_rooms` | Body: `{selectedRooms, familyId, vacationId, startDate, endDate}` | Assign rooms to a family (creates `room_taken` entries). |
| GET | `/user_rooms/:id/:vacationId` | `id` = familyId | Get rooms assigned to a family (with people counts). |
| GET | `/user_rooms/user/:id/:vacationId` | `id` = userId | Get room assigned to a specific user. |
| GET | `/user_rooms/users/:id/:vacationId` | `id` = familyId | Get all user-room assignments for a family (with occupancy counts). |
| POST | `/user_rooms/room` | Body: `{form, selectedChildRoomId, vacationId}` | Assign a specific user to a room. `form` includes `user_id` and `family_id`. |
| POST | `/user_rooms/room/parent/:id` | `id` = vacationId; Body: `{dataToSend}` | Assign a user to a room within a family context. `dataToSend` includes `userId, roomsId, familyId, status`. |

**Controller:** `services/userRooms/userRoomsController.js`

---

## Flights — `/flights`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/flights/:id` | `id` = vacationId; Body: flight details object | Add flight details for a user. |
| PUT | `/flights/:id/:vacationId` | `id` = userId, `vacationId` | Update flight details for a user. |
| GET | `/flights/:id/:familyId/:isInGroup/:vacationId` | All URL params | Get flight details for a user (includes arrival/departure from guest table and null-check flag). |
| GET | `/flights/family/:id` | `id` = familyId | Get all flights for a family where `is_source_user = 1`. ⚠️ Route path missing leading `/`, may not work correctly. |

**Controller:** `services/flights/flightsController.js`

---

## Payments — `/payments`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/payments/:id` | `id` = vacationId; Body: payment details | Add a payment record. |
| GET | `/payments/:id/:vacationId` | `id` = familyId | Get all payments for a family. |
| GET | `/payments/user/:id/:vacationId` | `id` = userId | Get payment history for a user (only paid payments, formatted dates). |

**Controller:** `services/payments/paymentsController.js`

---

## Notes — `/notes`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/notes/:id` | `id` = vacationId; Body: `{note, user_id, family_id, categoryName}` | Add a note for a user. |

**Controller:** `services/notes/notesController.js`

---

## Static/Reports — `/static`

Read-only endpoints for dashboard/report views.

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/static/user/:vacationId` | `vacationId` | Get all guests with room assignments (for guest table). |
| GET | `/static/user/main/:vacationId` | `vacationId` | Get main guests only (family heads) with family member counts. |
| GET | `/static/flights/:vacationId` | `vacationId` | Get all flight details joined with guest info (for flight report). |
| GET | `/static/vacation/:vacationId` | `vacationId` | Get comprehensive vacation details: all guests with flights, rooms, latest payments. |
| GET | `/static/payments/:vacationId` | `vacationId` | Get payment overview: all main guests with payment records and unpaid counts. |
| GET | `/static/payments/:vacationId/:userId` | `vacationId`, `userId` | Get payments for a specific user. |

**Controller:** `services/static/staticController.js`

---

## Budget — `/budget`

### Expense Categories

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/category/:id` | `id` = vacationId | Get all expense categories. |
| POST | `/budget/category/:id` | `id` = vacationId; Body: `{name}` | Add expense category. |
| PUT | `/budget/category/:id` | `id` = vacationId; Body: `{categoryId, name}` | Update expense category. |
| DELETE | `/budget/category/:id/:categoryId` | `id` = vacationId, `categoryId` | Delete expense category. |

### Expense Sub-Categories

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/sub_category/:id/:category_id` | `id` = vacationId, `category_id` | Get sub-categories for a category. |
| POST | `/budget/sub_category/:id` | `id` = vacationId; Body: `{categoryId, name}` | Add sub-category. |
| PUT | `/budget/sub_category/:id` | `id` = vacationId; Body: `{subCategoryId, name, categoryId}` | Update sub-category. |
| DELETE | `/budget/sub_category/:id/:subCategoryId/:categoryId` | `id` = vacationId, `subCategoryId`, `categoryId` | Delete sub-category. |

### Expenses (Actual)

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/expenses/:id` | `id` = vacationId | Get all actual expenses with category names. |
| POST | `/budget/expenses/:id` | `id` = vacationId; Body: expense object | Add an actual expense. |
| PUT | `/budget/expenses/:id` | `id` = vacationId; Body: expense update | Update an expense (amount, date, ILS equivalent). |
| PUT | `/budget/status_expenses/:id` | `id` = vacationId; Body: `{id, paymentStatus}` | Toggle expense paid status. |
| DELETE | `/budget/expenses/:id/:actionId` | `id` = vacationId, `actionId` | Delete an expense by action_id. |

### Future Expenses (Forecast)

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/future_expenses/:id` | `id` = vacationId | Get all future/planned expenses. |
| POST | `/budget/future_expenses/:id` | `id` = vacationId; Body: expense object | Add a future expense. |
| PUT | `/budget/future_expenses/:id` | `id` = vacationId; Body: expense update | Update a future expense. |

### Income Categories

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/income_category/:id` | `id` = vacationId | Get all income categories. |
| POST | `/budget/income_category/:id` | `id` = vacationId; Body: `{name}` | Add income category. |
| PUT | `/budget/income_category/:id` | `id` = vacationId; Body: `{categoryId, name}` | Update income category. |
| DELETE | `/budget/income_category/:id/:categoryId` | `id` = vacationId, `categoryId` | Delete income category. |

### Income Sub-Categories

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/income_sub_category/:id/:category_id` | `id` = vacationId, `category_id` | Get income sub-categories for a category. |
| POST | `/budget/income_sub_category/:id` | `id` = vacationId; Body: `{categoryId, name}` | Add income sub-category. |
| PUT | `/budget/income_sub_category/:id` | `id` = vacationId; Body: `{subCategoryId, name, categoryId}` | Update income sub-category. |
| DELETE | `/budget/income_sub_category/:id/:subCategoryId/:categoryId` | `id` = vacationId, `subCategoryId`, `categoryId` | Delete income sub-category. |

### Income

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/income/:id` | `id` = vacationId | Get all income records with category names. |
| POST | `/budget/income/:id` | `id` = vacationId; Body: income object | Add an income record. |
| PUT | `/budget/income/:id` | `id` = vacationId; Body: income update | Update income (amount, date, ILS, description). |
| PUT | `/budget/income_status/:id` | `id` = vacationId; Body: `{actionId, paymentStatus}` | Toggle income paid status. |
| DELETE | `/budget/income/:id/:actionId` | `id` = vacationId, `actionId` | Delete an income record. |

### Summary

| Method | Path | Params | Description |
|---|---|---|---|
| GET | `/budget/summary/:id` | `id` = vacationId | Get expense + income totals (paid, unpaid, total). |

**Controller:** `services/budget/budgetsController.js`

---

## File Uploads — `/uploads`

| Method | Path | Params | Description |
|---|---|---|---|
| POST | `/uploads/:vacationId` | `vacationId`; Body: multipart form with `file` field | Upload a file (PDF/JPEG only). Stored at `server/uploads/{vacationId}/{familyName}/`. |
| GET | `/uploads/files/:familyName/:vacationId` | `familyName`, `vacationId` | List all files for a family. |
| DELETE | `/uploads/files/:familyName/:vacationId/:file` | `familyName`, `vacationId`, `file` | Delete a specific file. |

**Controller:** `services/uploads/uploadsController.js`

**Note:** The `/uploads` route also serves static files via `express.static` for direct file access.

---

## Route Registration Order (server/index.js)

```
/auth          — authController       (BEFORE auth middleware)
── auth middleware applied ──
/user          — userController
/family        — familyController
/rooms         — roomsController
/user_rooms    — userRoomsController
/flights       — flightsController
/payments      — paymentsController
/notes         — notesController
/vacations     — vacationsController
/static        — staticController
/budget        — budgetController
/uploads       — express.static + uploadsController
── error handler ──
```

---

## Known Issues

1. **`GET /flights/family/:id`** — Route defined as `family/:id` (missing leading `/`), may not match correctly.
2. **`GET /rooms/count`** — Does not accept a vacationId parameter, likely broken (query references tables without schema prefix).
3. **`PUT /vacations`** — Empty handler, not implemented.
4. **`POST /rooms`** — Empty handler, not implemented.
5. **Route order for `/rooms`** — `/:vacationId/:startDate/:endDate` is defined before `/:vacationId`, which means 3-segment paths work but routes like `/rooms/count` may be intercepted as `vacationId = "count"` before reaching the `/count` handler. Express matches top-to-bottom, and `/rooms/count` has no `:startDate/:endDate` so it would fall through. However, `/rooms/room_available/:id/:startDate/:endDate` must be before `/:vacationId` to match — this works because the segment `room_available` distinguishes it.
