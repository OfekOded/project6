USE fullstack6;

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


INSERT INTO posts (user_id, title, body) VALUES
  (1, 'First day with the project', 'Set up the repo and the database schema. Everything connects.'),
  (1, 'Thoughts on REST', 'A clean resource layout makes the client code almost write itself.'),
  (2, 'Hello world', 'Just testing that posts show up on my profile page.'),
  (2, 'Weekend plans', 'Going to refactor the queries layer and add proper validation.'),
  (3, 'Reading list', 'Three articles on indexing and one on transactions. Recommended.'),
  (3, 'Bug of the day', 'Forgot a parameterized placeholder - fixed it in five minutes.'),
  (4, 'Quick note', 'Comments now cascade-delete with their post.'),
  (4, 'Status update', 'Ownership checks are in and tested.');
