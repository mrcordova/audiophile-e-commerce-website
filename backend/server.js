const mysql = require("mysql2");
const cors = require("cors");
const express = require("express");

const app = express();

const { createServer } = require("node:http");

require("dotenv").config();
const allowedOrigins = [
  "https://audiophile-e-commerce-website.onrender.com",
  "http://127.0.0.1:5500",
];

// const corsOptions = {
//   origin: "https://audiophile-e-commerce-website.onrender.com",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type"],
// };
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials:true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "bypass-tunnel-reminder",
    "Access-Control-Allow-Origin",
  ],
};

const PORT = process.env.PORT || 3001;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  typeCast: function (field, next) {
    if (field.type === "NEWDECIMAL") {
      return parseFloat(field.string());
    }
    return next();
  },
});
const poolPromise = pool.promise();
// connection.connect(function (err) {
//   if (err) throw err;

//   console.log("Conected!");
// });

app.use("*", cors(corsOptions));
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://audiophile-e-commerce-website.onrender.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, bypass-tunnel-reminder');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.options('*', cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));

app.get("/getData",  async (req, res) => {
  try {
    const cartQuery = "SELECT * FROM cart";
    const [cartRows] = await poolPromise.query(cartQuery);

    res.json({ data: cartRows });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      // Only send the response if headers have not been sent yet
      res.status(500).json({ error: "database error" });
    }
  }
});

app.post("/addProduct", async (req, res) => {
  try {
    const { product, price, amount, image } = req.body;
    const checkProductQuery =
      "SELECT 1 FROM `cart` WHERE `product` = ? LIMIT 1";

    const [rows] = await poolPromise.query({
      sql: checkProductQuery,
      values: [product],
    });
    if (rows.length == 0) {
      const productQuery =
        "INSERT INTO `cart`(`product`, `amount`, `price`, `image`) VALUES (?,?,?,?)";
      const [results, fields] = await poolPromise.query({
        sql: productQuery,
        values: [product, amount, price, image],
      });
    } else {
      const updateProductQuery =
        "UPDATE `cart` SET `amount` = ?, `price` = ?, `image` = ? WHERE `product` = ? LIMIT 1";
      const [results, fields] = await poolPromise.query({
        sql: updateProductQuery,
        values: [amount, price, image, product],
      });
    }
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      // Only send the response if headers have not been sent yet
      res.status(500).json({ error: "database error" });
    }
  }
});

app.put("/updateProduct/:productName", async (req, res) => {
  try {
    const { productName: product } = req.params;
    const { price, amount, image } = req.body;
    const updateProductQuery =
      "UPDATE `cart` SET `amount` = ?, `price` = ?, `image` = ? WHERE `product` = ? LIMIT 1";
    const [results, fields] = await poolPromise.query({
      sql: updateProductQuery,
      values: [amount, price, image, product],
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      // Only send the response if headers have not been sent yet
      res.status(500).json({ error: "database error" });
    }
  }
});
app.delete("/removeProduct/:productName", async (req, res) => {
  try {
    const { productName } = req.params;
    const deleteProductQuery = "DELETE FROM `cart` WHERE `product` = ? LIMIT 1";
    const [results, fields] = await poolPromise.query({
      sql: deleteProductQuery,
      values: [productName],
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      // Only send the response if headers have not been sent yet
      res.status(500).json({ error: "database error" });
    }
  }
});
app.delete("/removeAllProduct", async (req, res) => {
  try {
    const deleteProductQuery = "DELETE FROM cart";
    const [results, fields] = await poolPromise.query(deleteProductQuery);

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      // Only send the response if headers have not been sent yet
      res.status(500).json({ error: "database error" });
    }
  }
});
// Express example
app.get("/health-check", async (req, res) => {
  try {
    const cartQuery = "SELECT 1 FROM cart";
    const [cartRows] = await poolPromise.query(cartQuery);

    // res.json({ data: cartRows });
    res.status(200).json({ message: "Backend is active" });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      // Only send the response if headers have not been sent yet
      res.status(500).json({ error: "database error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`example app listening on port ${PORT}`);
});