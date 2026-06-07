-- File: server/db/sql/03_todos.sql
-- Purpose: todos table (N:1 to users) + seed data.
-- Owner: Partner A | Stage: A (שלב א)
USE fullstack6;

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TODO (Partner A): seed ~4-5 todos per user (user_id 1..4), mixed completed values.
-- INSERT INTO todos (user_id, title, completed) VALUES (1, 'buy milk', 0), (...);

-- EXAM NOTE: completed הוא TINYINT(1) - כך MySQL מייצג BOOLEAN. בצד הלקוח זה 0/1.
