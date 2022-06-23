require('dotenv').config();
const express = require("express");
const app = express();
const db = require("./database/client");
app.use(express.json());


const PORT = process.env.PGPORT || 3000;
 console.log(process.env.PGHOST);

app.get("/time", async (req, res) => {
  // Promises syntax (then)
  db.query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch((error) => {
      console.log(error.message);
      res.sendStatus(500);
    });
});

app.get("/api/clients", (req, res) => {
   db
    .query("SELECT * FROM users")
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.get("/", (req, res) => {
  res.send("Welcome to IMAD - the Internet Martial Artists Database");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
