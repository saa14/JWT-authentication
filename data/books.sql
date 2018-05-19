\c jwt_auth;

CREATE TABLE  books(
  ID SERIAL PRIMARY KEY,
  title VARCHAR,
  author VARCHAR,
  genre VARCHAR,
  pages INTEGER,
  language VARCHAR
);

INSERT INTO books (title, author, genre, pages, language)
  VALUES ('Gone Girl', 'Gillian Flynn', 'Thriller', 432, 'English');