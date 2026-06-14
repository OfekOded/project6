USE fullstack6;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS passwords (
  user_id INT PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed with fixed ids 1..4 because the posts and comments seeds reference them.
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

-- Passwords are stored in their own table (1:1 with users) so a normal SELECT on
-- users can never return one. Seeded with 6-char values to match the server policy.
INSERT INTO passwords (user_id, password) VALUES
  (1, '123456'),
  (2, '123456'),
  (3, '123456'),
  (4, '123456')
ON DUPLICATE KEY UPDATE
  password = VALUES(password);
