from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base

SQLALCHEMY_DATABASE_URL = 'sqlite:///./booking.db'

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def _migrate_seats_columns(conn):
    """
    One-off migration: replace `seats_available` on the `flights` table with
    three per-class columns (`seats_economy`, `seats_business`, `seats_galaxium`).

    SQLite < 3.35 does not support DROP COLUMN, so we use the standard
    table-rebuild approach:
      1. Create a new table with the desired schema.
      2. Copy data, distributing seats_available across the three new columns.
      3. Drop the old table.
      4. Rename the new table.
    """
    # Check whether the old column still exists
    result = conn.execute(text("PRAGMA table_info(flights)"))
    columns = [row[1] for row in result.fetchall()]

    if "seats_available" not in columns:
        # Already migrated — nothing to do
        return

    print("[db] Migrating flights table: seats_available -> seats_economy / seats_business / seats_galaxium")

    conn.execute(text("""
        CREATE TABLE flights_new (
            flight_id   INTEGER PRIMARY KEY AUTOINCREMENT,
            origin      TEXT    NOT NULL,
            destination TEXT    NOT NULL,
            departure_time TEXT NOT NULL,
            arrival_time   TEXT NOT NULL,
            price       INTEGER NOT NULL,
            seats_economy  INTEGER NOT NULL,
            seats_business INTEGER NOT NULL,
            seats_galaxium INTEGER NOT NULL
        )
    """))

    # Distribute existing seats:
    #   economy  = N // 3 + N % 3  (absorbs the remainder)
    #   business = N // 3
    #   galaxium = N // 3
    conn.execute(text("""
        INSERT INTO flights_new
            (flight_id, origin, destination, departure_time, arrival_time, price,
             seats_economy, seats_business, seats_galaxium)
        SELECT
            flight_id, origin, destination, departure_time, arrival_time, price,
            (seats_available / 3) + (seats_available % 3),
            (seats_available / 3),
            (seats_available / 3)
        FROM flights
    """))

    conn.execute(text("DROP TABLE flights"))
    conn.execute(text("ALTER TABLE flights_new RENAME TO flights"))

    print("[db] Migration complete.")


def _migrate_seat_class_column(conn):
    """
    One-off migration: add `seat_class` column to the `bookings` table.
    Existing rows default to 'economy'.
    """
    result = conn.execute(text("PRAGMA table_info(bookings)"))
    columns = [row[1] for row in result.fetchall()]

    if "seat_class" in columns:
        return

    print("[db] Migrating bookings table: adding seat_class column (default 'economy')")
    conn.execute(text("ALTER TABLE bookings ADD COLUMN seat_class TEXT NOT NULL DEFAULT 'economy'"))
    print("[db] Migration complete.")


def init_db():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        _migrate_seats_columns(conn)
        _migrate_seat_class_column(conn)
        conn.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
