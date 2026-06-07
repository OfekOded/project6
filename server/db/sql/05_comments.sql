-- File: server/db/sql/05_comments.sql
-- Purpose: comments table (N:1 to posts, N:1 to users) + seed data.
-- Owner: Partner B | Stage: A (שלב א)
USE fullstack6;

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TODO (Partner B): seed 2-3 comments per post, from DIFFERENT user_ids
-- (so stage E ownership checks can actually be demonstrated).

-- EXAM NOTE: ב-jsonplaceholder ל-comment יש name+email במקום user_id.
-- אנחנו שומרים user_id כי שלב ה דורש "עדכון/מחיקה רק אם הפריט שייך למשתמש הפעיל" -
-- וזה מחייב לדעת למי שייכת התגובה. ON DELETE CASCADE: מחיקת post מוחקת את תגובותיו.
