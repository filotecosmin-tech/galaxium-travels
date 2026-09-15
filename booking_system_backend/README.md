# Galaxium Booking System

A unified booking system for Galaxium Travels that serves both **REST API** and **MCP (Model Context Protocol)** from a single server.

## Features

- **Dual Protocol Support**: Same business logic exposed via REST and MCP
- **Single Server**: One codebase, one port, both protocols
- **SQLite Database**: Simple file-based storage for demos
- **Demo Data**: Pre-seeded with space travel flights and users

## Quick Start

```bash
cd booking_system_backend
pip install -r requirements.txt
python server.py
```

The server starts on port **8080** with:
- REST endpoints at `/flights`, `/book`, `/bookings`, `/cancel`, `/register`, `/user`
- MCP tools at `/mcp`
- Swagger UI at `/docs`

## API Reference

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/flights` | List all available flights |
| POST | `/book` | Book a flight |
| GET | `/bookings/{user_id}` | Get user's bookings |
| POST | `/cancel/{booking_id}` | Cancel a booking |
| POST | `/register` | Register a new user |
| GET | `/user?name=...&email=...` | Get user by name and email |

### MCP Tools

| Tool | Description |
|------|-------------|
| `list_flights` | List all available flights |
| `book_flight` | Book a seat on a flight |
| `get_bookings` | Get user's bookings |
| `cancel_booking` | Cancel a booking |
| `register_user` | Register a new user |
| `get_user_id` | Get user by name and email |

## Testing

```bash
pytest
```

## Project Structure

```
booking_system_backend/
├── server.py          # Main server - exposes REST & MCP
├── services/          # Business logic layer
│   ├── booking.py     # Booking operations
│   ├── flight.py      # Flight operations
│   └── user.py        # User operations
├── models.py          # SQLAlchemy ORM models
├── schemas.py         # Pydantic request/response schemas
├── db.py              # Database configuration
├── seed.py            # Demo data seeding
├── tests/             # Test suite
│   ├── test_services.py
│   └── test_rest.py
├── requirements.txt
├── Dockerfile
└── pytest.ini
```
