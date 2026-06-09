-- File: server/db/sql/05_comments.sql
-- Purpose: comments table (N:1 to posts AND to users) + seed data.
-- Owner: Partner B | Stage: A (שלב א) + E (שלב ה)
USE fullstack6;

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed: a few comments across posts. post_id 1..8 come from 04_posts.sql, user_id 1..4 from 02.
INSERT INTO comments (post_id, user_id, body) VALUES
  (1, 2, 'Nice, glad the setup went smoothly.'),
  (1, 3, 'Which MySQL version are you on?'),
  (2, 4, 'Agreed - good naming saves a lot of guessing.'),
  (3, 1, 'Welcome aboard!'),
  (5, 2, 'Can you share the indexing article?'),
  (7, 3, 'Cascade delete is underrated.'),
  (7, 1, 'Saves writing cleanup code by hand.'),
  (8, 2, 'Tested it too - 403 on a post that is not mine. Works.');

-- EXAM NOTES:
-- * סטייה מ-jsonplaceholder (מודע): שם ל-comment יש name/email כטקסט חופשי. כאן יש user_id
--   (FK ל-users) במקום - כי בשלב ה צריך לדעת מי הבעלים של תגובה כדי לאכוף עריכה/מחיקה.
-- * שם המגיב לא נשמר בטבלה אלא נשלף ב-JOIN ל-users (ראו comments.queries.js) -
--   מקור אמת אחד: אם משתמש משנה שם, התגובות הישנות מציגות את השם המעודכן אוטומטית.
-- * שני FK עם CASCADE: מחיקת post מוחקת את תגובותיו; מחיקת user מוחקת את תגובותיו.
