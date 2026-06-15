USE fullstack6;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(30),
  blocked TINYINT(1) NOT NULL DEFAULT 0,
  is_admin TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS passwords (
  user_id INT PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (id, username, name, email, phone, blocked, is_admin) VALUES
  (1, 'shlomo', 'Shlomo Kipnis', 'shlomo@example.com', '050-0000001', 0, 1),
  (2, 'miriam', 'Miriam Cohen', 'miriam@example.com', '050-0000002', 0, 0),
  (3, 'david', 'David Levi', 'david@example.com', '050-0000003', 0, 0),
  (4, 'noa', 'Noa Mizrahi', 'noa@example.com', '050-0000004', 0, 0)
ON DUPLICATE KEY UPDATE
  username = VALUES(username),
  name = VALUES(name),
  email = VALUES(email),
  phone = VALUES(phone),
  blocked = VALUES(blocked),
  is_admin = VALUES(is_admin);

INSERT INTO passwords (user_id, password) VALUES
  (1, '123456'),
  (2, '123456'),
  (3, '123456'),
  (4, '123456')
ON DUPLICATE KEY UPDATE
  password = VALUES(password);