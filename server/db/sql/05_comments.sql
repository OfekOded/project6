USE fullstack6;

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO comments (post_id, user_id, body) VALUES
  (1, 2, 'Nice, glad the setup went smoothly.'),
  (1, 3, 'Which MySQL version are you on?'),
  (2, 4, 'Agreed - good naming saves a lot of guessing.'),
  (3, 1, 'Welcome aboard!'),
  (5, 2, 'Can you share the indexing article?'),
  (7, 3, 'Cascade delete is underrated.'),
  (7, 1, 'Saves writing cleanup code by hand.'),
  (8, 2, 'Tested it too - 403 on a post that is not mine. Works.');
