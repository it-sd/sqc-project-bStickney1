\encoding UTF8

DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS likes;

CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  video_id INTEGER NOT NULL,
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL
);

INSERT INTO videos (title, description, duration)
  VALUES 
  ('Test Video Title', 'Test description of the video', 120);