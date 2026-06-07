-- File: server/db/sql/04_posts.sql
-- Purpose: posts table (N:1 to users) + seed data.
-- Owner: Partner B | Stage: A (שלב א)
USE fullstack6;

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TODO (Partner B): seed ~3 posts per user with FIXED ids 1..N
-- (Partner B's comments seed in 05 references these post ids).
-- INSERT INTO posts (user_id, title, body) VALUES (1, 'first post', 'lorem...'), (...);
