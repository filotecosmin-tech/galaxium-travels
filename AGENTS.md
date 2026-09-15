# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure

Monorepo with two independent services:
- `booking_system_frontend/` — React + TypeScript (Vite, port 5173 in dev)
- `booking_system_backend/` — FastAPI + Python (Uvicorn, port **8080**)

**All commands must be run from their respective subdirectories**, not the repo root.

## Commands

### Frontend (`booking_system_frontend/`)
```bash
npm run dev        # start dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint .
npm run preview    # preview production build
```
No test suite exists for the frontend.

### Backend (`booking_system_backend/`)
```bash
uvicorn server:app --reload --port 8080   # start dev server
pytest                                    # run all tests (uses pytest.ini: testpaths=tests)
pytest tests/test_services.py::TestBookingService::test_book_flight  # single test
pytest -k "book_flight"                  # filter by keyword
```

## Non-Obvious Architecture

- **Backend is dual-protocol**: the same business logic is exposed as both REST endpoints and MCP tools. `server.py` creates a `FastMCP` instance first, registers MCP tools calling the same service functions, then mounts the MCP HTTP app at `/mcp` on the FastAPI app.
- **SQLite migration runs on every startup** inside `db.py`: two inline migrations (`_migrate_seats_columns`, `_migrate_seat_class_column`) run at `init_db()` time. They use a table-rebuild pattern because SQLite doesn't support `DROP COLUMN`.
- **Database is seeded on every startup** — `seed()` is called in the FastAPI lifespan hook. It only seeds if tables are empty.
- **Service functions return a union type**, not exceptions: `Union[BookingOut, ErrorResponse]`. Callers must check `isinstance(result, ErrorResponse)`.
- **Frontend API base URL** is set via `VITE_API_URL` env var (default `http://localhost:8080`), defined in `src/services/api.ts`.

## Seat Class System (core domain concept)

Three seat classes: `economy | business | galaxium`. Price multipliers: `1×, 2×, 4×`.
- Seat counts are separate columns on `Flight`: `seats_economy`, `seats_business`, `seats_galaxium`
- Booking stores the chosen `seat_class`; cancellation restores the correct column
- `SEAT_CLASS_LABELS` and `SEAT_CLASS_MULTIPLIERS` constants are defined in `booking_system_frontend/src/types/index.ts` — import from there, don't redefine
- Backend mapping lives in `booking_system_backend/services/booking.py`: `SEAT_CLASS_COLUMNS` dict

## Code Style

### TypeScript / React
- **Strict mode** is on (`noUnusedLocals`, `noUnusedParameters` enforced by compiler)
- Custom Tailwind color tokens must be used for the space theme: `space-dark`, `space-blue`, `cosmic-purple`, `nebula-pink`, `alien-green`, `solar-orange`, `star-white` (defined in `tailwind.config.js`)
- Custom animations available via Tailwind: `animate-float`, `animate-twinkle`, `animate-space-gradient`, `animate-cosmic-gradient`
- Use `date-fns` for date formatting — helpers already exist in `src/utils/formatters.ts` (`formatDate`, `formatTime`, `formatCurrency`, `calculateDuration`)
- Icons: use `lucide-react` exclusively
- Notifications: use `react-hot-toast` (`toast.success()`, `toast.error()`)
- User auth state: consume via `useUser()` hook (wraps `UserContext`)

### Python / FastAPI
- Pydantic schemas in `schemas.py` — add new schemas there, not inline in endpoints
- Error responses always use `ErrorResponse` schema with `success: False`, `error`, `error_code`, and optional `details`
- DB session is injected as a parameter — don't create sessions inside service functions
- Type hints required throughout; Pydantic validates all request/response shapes

## Testing (Backend Only)
- Test DB uses in-memory SQLite — fixtures in `tests/conftest.py`
- `client` fixture overrides the FastAPI dependency for `get_db`
- **Note**: Some existing fixtures still reference the old `seats_available` column; they need updating if new seat-class tests are added
