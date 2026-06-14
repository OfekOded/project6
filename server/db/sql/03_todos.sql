USE fullstack6;

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed: 4 todos per user (user_id 1..4), with mixed completed values.
INSERT INTO todos (id, user_id, title, completed) VALUES
  (1, 1, 'Set up the database connection', 1),
  (2, 1, 'Check login with the seeded password', 0),
  (3, 1, 'Review REST routes in Postman', 0),
  (4, 1, 'Prepare project demo notes', 1),
  (5, 2, 'Write todo page UI', 1),
  (6, 2, 'Add filters for open and done tasks', 0),
  (7, 2, 'Test updating completed status', 0),
  (8, 2, 'Clean up form validation messages', 1),
  (9, 3, 'Read the Express Router notes', 1),
  (10, 3, 'Practice parameterized MySQL queries', 1),
  (11, 3, 'Create a new todo from the client', 0),
  (12, 3, 'Delete an old todo item', 0),
  (13, 4, 'Open the info page after login', 1),
  (14, 4, 'Make sure passwords are never returned', 1),
  (15, 4, 'Try todos with completed filter', 0),
  (16, 4, 'Run the final client build', 0)
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  title = VALUES(title),
  completed = VALUES(completed);
