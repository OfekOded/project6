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
  password VARCHAR(255) NOT NULL,
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

-- all seed users have the password "123456", stored hashed (salt:hash)
INSERT INTO passwords (user_id, password) VALUES
  (1, '0de01b504483ab21eb85c4332fcf4eed:a687c1bb7669df25e7edf835d2046bbeb119a2c88fc0b68a58fc73032729b11cb7a7de7cc0c212c262e5fc7cd05b11469db8547eb9371910203024f8d684c130'),
  (2, 'e949d2e865be80d255ff3f1f9d777d1a:8f9e397cb2d15d381a55083095bc96c3cca3ac85b81f22d5a13b1a54b5884063b666f58435bca73fe4fc6695b49c2315f85e9a08c686c5df459acfc4e06842b0'),
  (3, 'f91d1b96a8b57c104e825012763a3077:2672348740bebe5cb310179a350463d6f00022f41ec34e4cae1fdaac60bc58788e2a48072105a8d6d35d7c5056edfd0c8eec69d6a2175b90bd6b28948a661fe1'),
  (4, 'e4687be05281c53781e7608159e5f47e:fe454d05dc11d85f30bac8b82f5952ab96d69c875103fc2039b20fd99f3b64f0a5ace41590f200d2799c9773159f471212c9a03e9a2335265e1d57126fe461cb')
ON DUPLICATE KEY UPDATE
  password = VALUES(password);