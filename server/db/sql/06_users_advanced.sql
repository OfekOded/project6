USE fullstack6;

-- Account-management columns. Run once on a database created before this change
-- (a fresh setup that runs 01..07 in order applies it here too).
ALTER TABLE users
  ADD COLUMN blocked  TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0;

-- The first seeded user is the system administrator.
UPDATE users SET is_admin = 1 WHERE id = 1;
