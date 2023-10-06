const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
app.use(express.json());
// app.use(express.text());

let db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

function generateId() {
  let timestamp = Date.now();
  let randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}

app.post("/message", (req, res) => {
  let serviceId = req.body.serviceId || "default";
  let tableName = `messages_${serviceId}`;
  console.log(`Creating table ${tableName} if it doesn't exist`); // Added log
  db.run(
    `CREATE TABLE IF NOT EXISTS ${tableName}(id text PRIMARY KEY, message text)`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }

      let id = generateId();
      let message = req.body.message;
      console.log(`Inserting message with id ${id} into ${tableName}`); // Added log
      db.run(
        `INSERT INTO ${tableName}(id, message) VALUES(?, ?)`,
        [id, message],
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          res.json({ id: id, serviceId: serviceId, message: message });
        }
      );
    }
  );
});

app.get("/messages", (req, res) => {
  let serviceId = req.body.serviceId || "default";
  let tableName = `messages_${serviceId}`;
  db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      db.all(`SELECT id, message FROM ${tableName}`, [], (err, rows) => {
        if (err) {
          throw err;
        }
        res.send(rows);
      });
    } else {
      res.status(404).send(`Invalid serviceId ${serviceId}. Table ${tableName} does not exist`);
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
