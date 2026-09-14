-- Only token hashes are retained. Pairing codes, model keys and WebSocket tickets are never stored here.
CREATE TABLE personal_devices (
  owner TEXT PRIMARY KEY NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE personal_realtime_tickets (
  ticket_hash TEXT PRIMARY KEY NOT NULL,
  owner TEXT NOT NULL REFERENCES personal_devices(owner),
  origin TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX personal_realtime_ticket_expiry ON personal_realtime_tickets(expires_at);
