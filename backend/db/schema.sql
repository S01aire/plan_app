PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  username   TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plans (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK(type IN ('single', 'longterm', 'habit')),
  title       TEXT NOT NULL,
  note        TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '🌟',
  color_tag   TEXT NOT NULL DEFAULT '#FF8C42',
  target_date TEXT,
  deadline    TEXT,
  week_days   TEXT,
  archived    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkins (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id     TEXT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  date        TEXT NOT NULL,
  checked_at  TEXT NOT NULL,
  UNIQUE(plan_id, date)
);

CREATE INDEX IF NOT EXISTS idx_plans_user    ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_plan ON checkins(plan_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(date);
