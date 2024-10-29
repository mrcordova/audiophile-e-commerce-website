const mysql = require("mysql2");
const cors = require("cors");

const { createServer } = require("node:http");

require("dotenv").config();

const corsOptions = {
  origin: "https://audiophile-e-commerce-website.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const allowedOrigins = ["https://audiophile-e-commerce-website.onrender.com"];

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
  // Add CORS headers to allow the specific frontend origin
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://audiophile-e-commerce-website.onrender.com"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Respond to OPTIONS preflight requests with 204 (No Content)
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "getData" && req.method == "GET") {
    const cartQuery = "SELECT * FROM cart";
    try {
      const [cartRows] = await connection.promise().execute(cartQuery);
      console.log(cartRows);
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
