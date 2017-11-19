DROP DATABASE IF EXISTS Eventger;

CREATE DATABASE Eventger;

USE Eventger;

CREATE TABLE users (
  id INT AUTO_INCREMENT,
  username VARCHAR(150),
  location VARCHAR(20),
  password VARCHAR(20),
  PRIMARY KEY (id)
);

CREATE TABLE events (

  id INT AUTO_INCREMENT,
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
  event_id INT,
  FOREIGN KEY (user_id)
    REFERENCES users(id),
  FOREIGN KEY (event_id)
    REFERENCES events(id)
);
