-- File: server/db/sql/04_posts.sql
-- Purpose: posts table (N:1 to users) + seed data.
-- Owner: Partner B | Stage: A (שלב א) + E (שלב ה)
-- Run order: 01 -> 02 -> 03 -> 04 -> 05  (users must exist first)
USE fullstack6;

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed: two posts per user (user_id 1..4 come from 02_users_passwords.sql).
-- ids will auto-increment 1..8 in this exact order - 05_comments.sql relies on that.
INSERT INTO posts (user_id, title, body) VALUES
  (1, 'First day with the project', 'Set up the repo and the database schema. Everything connects.'),
  (1, 'Thoughts on REST', 'A clean resource layout makes the client code almost write itself.'),
  (2, 'Hello world', 'Just testing that posts show up on my profile page.'),
  (2, 'Weekend plans', 'Going to refactor the queries layer and add proper validation.'),
  (3, 'Reading list', 'Three articles on indexing and one on transactions. Recommended.'),
  (3, 'Bug of the day', 'Forgot a parameterized placeholder - fixed it in five minutes.'),
  (4, 'Quick note', 'Comments now cascade-delete with their post. Neat.'),
  (4, 'Status update', 'Stage E ownership checks are in and tested in Postman.');

-- EXAM NOTES:
-- * user_id הוא FK ל-users עם ON DELETE CASCADE: מחיקת משתמש מוחקת אוטומטית את כל הפוסטים שלו.
-- * body הוא TEXT (ולא VARCHAR) כי תוכן פוסט יכול להיות ארוך מ-255 תווים.
-- * created_at עם DEFAULT CURRENT_TIMESTAMP: ה-DB ממלא את הזמן לבד בכל INSERT,
--   אין צורך לשלוח אותו מהקוד. הלקוח מציג אותו בפורמט מקומי.
-- * הקריאות מסודרות ORDER BY id (דרישת שלב ה) - הסדר יציב ולא תלוי בסדר הכנסה פנימי.
