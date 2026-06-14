-- File: server/db/sql/02_users_passwords.sql
-- Purpose: users table + separate passwords table (1:1) + seed data.
-- Owner: Partner A | Stage: A (שלב א)
USE fullstack6;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(30)
);
-- (jsonplaceholder has more fields - address/company/website - the course allows trimming.)

CREATE TABLE IF NOT EXISTS passwords (
  user_id INT PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed with FIXED ids 1..4 because Partner B's posts/comments seeds reference them.
INSERT INTO users (id, username, name, email, phone) VALUES
  (1, 'shlomo', 'Shlomo Kipnis', 'shlomo@example.com', '050-0000001'),
  (2, 'miriam', 'Miriam Cohen', 'miriam@example.com', '050-0000002'),
  (3, 'david', 'David Levi', 'david@example.com', '050-0000003'),
  (4, 'noa', 'Noa Mizrahi', 'noa@example.com', '050-0000004')
ON DUPLICATE KEY UPDATE
  username = VALUES(username),
  name = VALUES(name),
  email = VALUES(email),
  phone = VALUES(phone);

-- Seed passwords are 6 chars to satisfy the server password policy (PASSWORD_MIN = 6
-- in register.routes.js). Login itself does NOT enforce a minimum - it only verifies.
INSERT INTO passwords (user_id, password) VALUES
  (1, '123456'),
  (2, '123456'),
  (3, '123456'),
  (4, '123456')
ON DUPLICATE KEY UPDATE
  password = VALUES(password);

-- EXAM NOTES:
-- * למה טבלת passwords נפרדת? SELECT רגיל על users לעולם לא יכול להחזיר סיסמה בטעות,
--   ואפשר לתת לטבלה הרשאות GRANT שונות (ראו 01_init.sql). עיקרון least privilege.
-- * יחס 1:1: user_id הוא גם PK וגם FK. ON DELETE CASCADE: מחיקת user מוחקת את סיסמתו.
-- * רמת קורס: סיסמה בטקסט גלוי. בעולם אמיתי שומרים bcrypt hash (ראו EXAM_PREP.md).
