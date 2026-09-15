# Seat Classes Plan

## Overview

Add three seat classes — **Economy**, **Business**, and **Galaxium** — to the Galaxium Travels booking system. Each class on a flight has its own independent seat availability count and a price derived from a multiplier applied to the flight's base price (Economy = 1×, Business = 2×, Galaxium = 4×). The Flights page will display each class as a separate bookable row. The existing booking flow is preserved; the seat class is pre-selected from the row the user clicks and is stored on the booking record.

### Scope

- Backend: schema changes, migration of existing data, updated API contracts
- Frontend: updated types, flight display, booking modal, booking history

### Non-Goals

- Individual seat maps or seat assignment
- Multiple-seat bookings per transaction
- Dynamic / per-flight pricing overrides

---

## Sub-Tasks

### Sub-Task 1 — Backend: Extend the Flight model and database schema

**Status**: [x] done

### Sub-Task 2 — Backend: Extend the Booking model to store seat class

**Status**: [x] done

### Sub-Task 3 — Backend: Update Pydantic schemas and service logic

**Status**: [x] done

### Sub-Task 4 — Frontend: Update TypeScript types and API service

**Status**: [x] done

### Sub-Task 5 — Frontend: Update Flights page to show one row per class

**Status**: [x] done

### Sub-Task 6 — Frontend: Update BookingModal and booking history

**Status**: [x] done

## Price Multipliers Reference

| Class | Multiplier | Example (base = $500) |
|-------|------------|----------------------|
| Economy | 1× | $500 |
| Business | 2× | $1,000 |
| Galaxium | 4× | $2,000 |
