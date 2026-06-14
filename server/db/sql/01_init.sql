-- Run order: 01 -> 02 -> 03 -> 04 -> 05

CREATE DATABASE IF NOT EXISTS fullstack6
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE fullstack6;

-- The table definitions live in the next files in this order:
-- 02_users_passwords.sql -> 03_todos.sql -> 04_posts.sql -> 05_comments.sql.

-- ---------------------------------------------------------------------------
-- Access restriction plan: only the server's DB user may touch `passwords`.
-- Any other user gets table-level SELECT on everything EXCEPT passwords.
-- Run the following block separately as root/admin, adjust the passwords, then
-- put the app_server credentials in server/.env. It is kept commented here so
-- a normal schema setup will not fail for a user without CREATE USER privileges:
--
-- CREATE USER 'app_server'@'localhost' IDENTIFIED BY 'change_me';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fullstack6.* TO 'app_server'@'localhost';
--
-- CREATE USER 'reports'@'localhost' IDENTIFIED BY 'reports_pw';
-- GRANT SELECT ON fullstack6.users    TO 'reports'@'localhost';
-- GRANT SELECT ON fullstack6.todos    TO 'reports'@'localhost';
-- GRANT SELECT ON fullstack6.posts    TO 'reports'@'localhost';
-- GRANT SELECT ON fullstack6.comments TO 'reports'@'localhost';
-- -- (no grant on fullstack6.passwords => access denied)
-- ---------------------------------------------------------------------------
