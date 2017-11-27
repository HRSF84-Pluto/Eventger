const Promise = require('bluebird');

module.exports = (db) => {
  if (!db.queryAsync) {
    db = Promise.promisifyAll(db);
  }
  return db.queryAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT UNIQUE,
      username VARCHAR(150) UNIQUE,
      location VARCHAR(20),
      password VARCHAR(20),
      hash BINARY(60),
      preferences VARCHAR(500),
      PRIMARY KEY (id)
    );`)
    .then(() => {
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS events (
          id VARCHAR(20),
          eventName VARCHAR(2083),
          date VARCHAR(300),
          time VARCHAR(200),
          location VARCHAR(300),
          price VARCHAR(20),
          url VARCHAR(2083),
          photoUrl VARCHAR(2083),
          category VARCHAR(30),
          PRIMARY KEY (id)
        );`);
    })
    .then(() => {
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS usersEvents (
          user_id INT,
          event_id VARCHAR(20),
          FOREIGN KEY (user_id)
            REFERENCES users(id),
          FOREIGN KEY (event_id)
            REFERENCES events(id)
        );`);
    })
    .error(err => {
      console.log(err);
    });
};
