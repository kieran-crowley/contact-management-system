const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "database-1.cdi6sz3u1otd.eu-west-2.rds.amazonaws.com",
  user: "admin",
  password: "password", //for simplicity 
}); //

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.get("/contacts", (req, res) => {
  const searchTerm = req.query.search;
  let sql = "SELECT * FROM new_schemaa.new_table";

  if (searchTerm) {
    sql += " WHERE name LIKE ? OR email LIKE ? OR address LIKE ?";
    const values = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
    db.query(sql, values, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } else {
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }
});

app.post("/contacts", (req, res) => {
  const { name, email, phone_number, address } = req.body;
  const sql =
    "INSERT INTO new_schemaa.new_table (name, email, phone_number, address) VALUES (?, ?, ?, ?)";
  const values = [name, email, phone_number, address];

  db.query(sql, values, (err, result) => {
    if (err) throw err;
    res.json({ message: "Contact added!", id: result.insertId });
  });
});

app.put("/contacts/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, phone_number, address } = req.body;
  const sql =
    "UPDATE new_schemaa.new_table SET name=?, email=?, phone_number=?, address=? WHERE id=?";
  const values = [name, email, phone_number, address, id];

  db.query(sql, values, (err) => {
    if (err) throw err;
    res.json({ message: "Contact updated!", id });
  });
});

app.delete("/contacts/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM new_schemaa.new_table WHERE id=?";

  db.query(sql, [id], (err) => {
    if (err) throw err;
    res.json({ message: "Contact deleted!", id });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
