const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
app.use(express.json());
app.use(express.text());

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

app.post("/message/:serviceId?", (req, res) => {
  let serviceId = req.params.serviceId || 'default';
  let tableName = `messages_${serviceId}`;
  db.run(`CREATE TABLE IF NOT EXISTS ${tableName}(id text PRIMARY KEY, body text)`, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  let id = generateId();
  let body = req.body;
  db.run(
    `INSERT INTO ${tableName}(id, body) VALUES(?, ?)`,
    [id, body],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      res.json({id: id, body: body});
    }
  );
});

app.get("/messages/:serviceId?", (req, res) => {
  let serviceId = req.params.serviceId || 'default';
  let tableName = `messages_${serviceId}`;
  db.all(`SELECT id, body FROM ${tableName}`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});