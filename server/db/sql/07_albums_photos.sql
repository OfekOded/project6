USE fullstack6;

CREATE TABLE IF NOT EXISTS albums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

INSERT INTO albums (id, user_id, title) VALUES
  (1, 1, 'Project screenshots'),
  (2, 1, 'Team photos'),
  (3, 2, 'UI mockups'),
  (4, 2, 'Whiteboard sessions'),
  (5, 3, 'Reading notes'),
  (6, 3, 'Conference 2026'),
  (7, 4, 'Release party'),
  (8, 4, 'Office plants')
ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), title = VALUES(title);

INSERT INTO photos (album_id, title, url, thumbnail_url) VALUES
  (1, 'Login screen',        'https://picsum.photos/seed/p1/600/400',  'https://picsum.photos/seed/p1/150/100'),
  (1, 'Dashboard',           'https://picsum.photos/seed/p2/600/400',  'https://picsum.photos/seed/p2/150/100'),
  (1, 'Posts feed',          'https://picsum.photos/seed/p3/600/400',  'https://picsum.photos/seed/p3/150/100'),
  (2, 'Standup',             'https://picsum.photos/seed/p4/600/400',  'https://picsum.photos/seed/p4/150/100'),
  (2, 'Lunch break',         'https://picsum.photos/seed/p5/600/400',  'https://picsum.photos/seed/p5/150/100'),
  (2, 'Demo day',            'https://picsum.photos/seed/p6/600/400',  'https://picsum.photos/seed/p6/150/100'),
  (3, 'Wireframe v1',        'https://picsum.photos/seed/p7/600/400',  'https://picsum.photos/seed/p7/150/100'),
  (3, 'Color palette',       'https://picsum.photos/seed/p8/600/400',  'https://picsum.photos/seed/p8/150/100'),
  (3, 'Component sheet',     'https://picsum.photos/seed/p9/600/400',  'https://picsum.photos/seed/p9/150/100'),
  (4, 'Architecture',        'https://picsum.photos/seed/p10/600/400', 'https://picsum.photos/seed/p10/150/100'),
  (4, 'Data model',          'https://picsum.photos/seed/p11/600/400', 'https://picsum.photos/seed/p11/150/100'),
  (4, 'Roadmap',             'https://picsum.photos/seed/p12/600/400', 'https://picsum.photos/seed/p12/150/100'),
  (5, 'Indexing notes',      'https://picsum.photos/seed/p13/600/400', 'https://picsum.photos/seed/p13/150/100'),
  (5, 'Transactions',        'https://picsum.photos/seed/p14/600/400', 'https://picsum.photos/seed/p14/150/100'),
  (5, 'Normalization',       'https://picsum.photos/seed/p15/600/400', 'https://picsum.photos/seed/p15/150/100'),
  (6, 'Keynote',             'https://picsum.photos/seed/p16/600/400', 'https://picsum.photos/seed/p16/150/100'),
  (6, 'Workshop',            'https://picsum.photos/seed/p17/600/400', 'https://picsum.photos/seed/p17/150/100'),
  (6, 'Networking',          'https://picsum.photos/seed/p18/600/400', 'https://picsum.photos/seed/p18/150/100'),
  (7, 'Cake',                'https://picsum.photos/seed/p19/600/400', 'https://picsum.photos/seed/p19/150/100'),
  (7, 'Group photo',         'https://picsum.photos/seed/p20/600/400', 'https://picsum.photos/seed/p20/150/100'),
  (7, 'Speeches',            'https://picsum.photos/seed/p21/600/400', 'https://picsum.photos/seed/p21/150/100'),
  (8, 'Monstera',            'https://picsum.photos/seed/p22/600/400', 'https://picsum.photos/seed/p22/150/100'),
  (8, 'Succulents',          'https://picsum.photos/seed/p23/600/400', 'https://picsum.photos/seed/p23/150/100'),
  (8, 'Fern',                'https://picsum.photos/seed/p24/600/400', 'https://picsum.photos/seed/p24/150/100');
