const mysql = require("mysql2");
const cors = require("cors");

const { createServer } = require("node:http");

require("dotenv").config();

const corsOptions = {
  origin: "https://audiophile-e-commerce-website.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const PORT = process.env.PORT || 3000;

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  typeCast: function (field, next) {
    if (field.type === "NEWDECIMAL") {
      return parseFloat(field.string());
    }
    return next();
  },
});

connection.connect(function (err) {
  if (err) throw err;

  console.log("Coonected!");
});

const server = createServer(async (req, res) => {
  if (req.url === "getData" && req.method == "GET") {
    const cartQuery = "SELECT * FROM cart";
    try {
      const [cartRows] = await connection.promise().execute(cartQuery);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cartRows));
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("failed");
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
