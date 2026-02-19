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
