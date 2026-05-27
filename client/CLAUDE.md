# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server on port 3000
npm run build      # Production build
npm test           # Jest test runner (react-scripts test)
```

## Architecture

This is the **client** for a vacation/trip management platform ("Avimor Tourism Online"). It is a React 18 app bootstrapped with Create React App, written in plain JavaScript (no TypeScript).

### Tech Stack
- **State**: Redux Toolkit (11 slices in `src/store/slice/`)
- **Routing**: React Router v6 — three authenticated routes: `/workspace`, `/static`, `/budgets`; unauthenticated shows Login
- **UI**: Material-UI v5 with styled-components
- **HTTP**: Axios via shared instance in `src/apis/baseApi.js` (base URL from `REACT_APP_SERVER_BASE_URL`, default `http://localhost:4000/`)
- **Tables**: ag-grid-react; **Charts**: chart.js/react-chartjs-2; **Export**: jspdf, xlsx

### Component Pattern
Components follow a split convention:
- `Component.jsx` — container/logic (state, dispatch, effects)
- `Component.view.jsx` — presentational (receives props, renders JSX)
- `Component.style.js` — styled-components / MUI `makeStyles`

### Key Directories
- `src/apis/` — one module per domain (`userRequest.js`, `roomsRequest.js`, etc.), all using `baseApi` axios instance with Bearer token auth
- `src/store/slice/` — Redux slices; `authSlice` and `vacationSlice` persist to sessionStorage
- `src/components/main/body/` — page-level views (Login, Static, WorkSpace, Budgets)
- `src/components/Dialogs/` — reusable modal dialogs (Guest, Flights, Payments, RoomsAssigner, etc.)
- `src/utils/constants.js` — API endpoint paths

### Auth & Session
- Token and user data stored in `sessionStorage` (not localStorage — cleared on tab close)
- All API calls include Bearer token via Authorization header
- Most data is scoped by `vacationId` (stored in `sessionStorage.vacId`)

### Conventions
- UI text is in **Hebrew** with RTL layout considerations
- API endpoints follow pattern: `/{resource}/{vacationId}`
- Redux pattern: `useSelector`/`useDispatch` hooks; dialog state managed via `dialogSlice`
- Notifications via react-toastify driven by `snackBarSlice`

## Code structure & file-size conventions

These rules apply to **new** code. Existing oversized files (`pages/FamilyList/FamilyList.view.jsx` ~900, `pages/FamilyList/FamilyList.jsx` ~600, `shared/GuestEditor/GuestEditor.jsx` ~470, `pages/RoomsStatus/RoomStatusOverview/RoomStatusOverview.jsx` ~480) are known outliers awaiting refactor — don't use them as templates.

### File-size targets

- **Target:** ≤ 300 lines per `.jsx` / `.view.jsx`.
- **Soft limit:** at ~400 lines, extract a subcomponent into a subfolder.
- **Hard signal:** ≥ 500 lines.
- **`.style.js`** can run longer (~400) since style objects are repetitive; same hard signal applies past that.

Clean reference files: `pages/Leads/LeadDetailPanel.*`, `pages/RoomsStatus/RoomDetailPanel.*`, `pages/Settings/Settings.*`.

### The .jsx / .view.jsx / .style.js split is a hard rule

Every component — even tiny ones — uses all three files:

- `Component.jsx` — container/logic. Hooks, `useSelector`/`useDispatch`, side effects, API calls via `apis/<feature>Request.js`, local state, handlers. Renders `<ComponentView ... />` with props.
- `Component.view.jsx` — presentational JSX only. Everything arrives via props. **No `useDispatch`, no API imports, no business state.** A formatter used only by this view can sit at the top of the file (see `formatDate` in `Leads.view.jsx`).
- `Component.style.js` — `makeStyles` / styled-components. Can export tightly-coupled visual constants (e.g. `STATUS_CONFIG` in `Leads.style.js`).

If you find yourself adding `useState` or `useDispatch` to a `.view.jsx`, the state belongs in the container.

### Folder layout for a new page

Simple page:

```
client/src/components/pages/Foo/
  Foo.jsx
  Foo.view.jsx
  Foo.style.js
```

Page with subcomponents (detail panels, dialogs, sub-sections used only by this page):

```
client/src/components/pages/Foo/
  Foo.jsx
  Foo.view.jsx
  Foo.style.js
  FooDetailPanel.jsx           // sibling files for small subcomponents
  FooDetailPanel.view.jsx
  FooDetailPanel.style.js
  SomeDialog/                  // promote to subfolder once it has its own triad
    SomeDialog.jsx
    SomeDialog.view.jsx
    SomeDialog.style.js
```

Promote a subcomponent into its own subfolder once it has its own `.jsx`/`.view.jsx`/`.style.js` triad, or once it gets reused. Reference: `pages/RoomsStatus/` (subfolders for `AssignFamilyDialog/`, `MoveRoomDialog/`, `RoomRoster/`, `RoomStatusOverview/`).

### Where things go

- **Reused across pages** → `components/shared/<Name>/`.
- **Unauthenticated page** (mounted at `/public/...`) → `components/Public/<Name>/`.
- **Layout chrome** (Header, Sidebar, RequireVacation, NotificationBell) → `components/layout/<Name>/`.
- **Page (route target)** → `components/pages/<Name>/`.

Don't invent new top-level component categories.

### Feature name mirrors across layers

For a feature `foo`, every layer uses the same name:

- `client/src/apis/fooRequest.js` — calls into `baseApi`, returns data. No business logic.
- `client/src/store/slices/fooSlice.js` — one slice per feature.
- `client/src/components/pages/Foo/` (or `shared/Foo/`, or `Public/Foo/`).
- API path constants in `client/src/utils/constants.js`.

### When to extract shared logic vs inline it

Default: **inline.** Don't lift a helper until you have a second caller.

Extract when:
- The same formatter/normalizer appears in two or more components → `client/src/utils/helpers/` (see `formatDate.js`, used by Leads + FamilyList).
- A reusable selector pattern — colocate it inside the slice file. No standalone `selectors/` directory.

Do **not** extract:
- A formatter used in one view file only — define it at the top of that file (see top of `Leads.view.jsx`).
- One-off style constants — keep them in that component's `.style.js`.

### Things that keep the good files good

- **No business state, dispatch, or API imports in `.view.jsx`.**
- **One slice per feature**, slice name matches feature name. No mega-slices.
- **API modules return data, nothing else.** No business logic in `apis/`.
- **Comments explain WHY** (RTL/BiDi handling, date-shift workarounds, MUI quirks). Don't narrate what the code does.

## STRICT RULES — DO NOT VIOLATE

### Never do any of the following without explicit permission:
- `npm run build` / `npm build` / any build or compile command
- `npm start` / `npm run start` / starting the dev server
- Run migrations on production databases
- Delete or drop database tables
- Push to git (`git push`)
- Deploy anything
- Run any destructive command

**Only write code. Leave testing, building, running, and deploying to the user.**

- **NEVER browse or search inside `node_modules/`.** Do not glob, grep, read, or inspect anything in `node_modules`. If you need to know a package version, check `package.json` only.
