-- File: server/db/sql/02_users_passwords.sql
-- Purpose: users table + separate passwords table (1:1) + seed data.
-- Owner: Partner A | Stage: A (שלב א)
USE fullstack6;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(30)
);
-- (jsonplaceholder has more fields - address/company/website - the course allows trimming.)

CREATE TABLE passwords (
  user_id INT PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TODO (Partner A): seed 3-4 users with FIXED ids 1..4 (Partner B's seeds reference them!)
-- INSERT INTO users (username, name, email, phone) VALUES
--   ('shlomo', 'Shlomo Kipnis', 'shlomo@example.com', '050-0000001'),
--   (...);
-- INSERT INTO passwords (user_id, password) VALUES (1, '1234'), (...);

-- EXAM NOTES:
-- * למה טבלת passwords נפרדת? SELECT רגיל על users לעולם לא יכול להחזיר סיסמה בטעות,
--   ואפשר לתת לטבלה הרשאות GRANT שונות (ראו 01_init.sql). עיקרון least privilege.
-- * יחס 1:1: user_id הוא גם PK וגם FK. ON DELETE CASCADE: מחיקת user מוחקת את סיסמתו.
-- * רמת קורס: סיסמה בטקסט גלוי. בעולם אמיתי שומרים bcrypt hash (ראו EXAM_PREP.md).
