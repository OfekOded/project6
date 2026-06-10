-- File: server/db/sql/01_init.sql
-- Purpose: create the database + document DB-level access restriction for the passwords table.
-- Owner: Partner A | Stage: A (שלב א)
-- Run order: 01 -> 02 -> 03 -> 04 -> 05

CREATE DATABASE IF NOT EXISTS fullstack6
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE fullstack6;

-- The table definitions live in the next files in this order:
-- 02_users_passwords.sql -> 03_todos.sql -> 04_posts.sql -> 05_comments.sql.
-- This file intentionally creates/selects the database only, so the schema files
-- can be re-read and explained one by one during the project presentation.

-- ---------------------------------------------------------------------------
-- Access restriction plan (דרישת שלב א: "תכננו הגבלות גישה עבור טבלה זו"):
-- only the server's DB user may touch `passwords`. Any other user (reports,
-- a curious classmate...) gets table-level SELECT on everything EXCEPT passwords.
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

-- EXAM NOTE: "הגבלת גישה" כאן = הרשאות ברמת טבלה (GRANT) + הקוד עצמו:
-- רק db/login.queries.js ו-db/register.queries.js נוגעים בטבלת passwords.
