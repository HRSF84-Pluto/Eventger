DROP DATABASE IF EXISTS Eventger;
CREATE DATABASE Eventger;
USE Eventger;

CREATE TABLE users (
  id INT AUTO_INCREMENT UNIQUE,
  username VARCHAR(20) UNIQUE,
  location VARCHAR(20),
  password VARCHAR(20),
  hash BINARY(60),
  PRIMARY KEY (id)
);

CREATE TABLE events (
  id VARCHAR(20),
  eventName VARCHAR(150),
  date VARCHAR(300),
  time VARCHAR(200),
  location VARCHAR(300),
  price VARCHAR(20),
  url VARCHAR(100),
  photoUrl VARCHAR(100),
  category VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE usersEvents (

  user_id INT,
  event_id VARCHAR(20),
  FOREIGN KEY (user_id)
    REFERENCES users(id),
  FOREIGN KEY (event_id)
    REFERENCES events(id)
);

-- OBJECT Example
-- User Object
-- {
--   username: string
--   location: string with zipcode
--   password: leave blank
-- }

-- Event Obj
-- {
--   eventName: string
--   date: string
--   time: string
--   location: {
--     line_1: string
--     line_2: string
--     city: string
--     state: string two letter
--     zip: string
--     }
--   price: string
--   url: string
--   photoUrl: string
--   category: string
-- }
