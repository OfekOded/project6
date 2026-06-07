-- File: server/db/sql/01_init.sql
-- Purpose: create the database + plan DB-level access restriction for the passwords table.
-- Owner: Partner A | Stage: A (שלב א)
-- Run order: 01 -> 02 -> 03 -> 04 -> 05

CREATE DATABASE IF NOT EXISTS fullstack6 CHARACTER SET utf8mb4;
USE fullstack6;

-- ---------------------------------------------------------------------------
-- Access restriction plan (דרישת שלב א: "תכננו הגבלות גישה עבור טבלה זו"):
-- only the server's DB user may touch `passwords`. Any other user (reports,
-- a curious classmate...) gets table-level SELECT on everything EXCEPT passwords.
-- Run as root, adjust the password, then put it in server/.env:
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
