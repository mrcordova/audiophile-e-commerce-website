const mysql = require("mysql2");
const cors = require("cors");
const express = require("express");

const app = express();

const { createServer } = require("node:http");

require("dotenv").config();

const corsOptions = {
  origin: "https://audiophile-e-commerce-website.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
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

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));

app.get("/getData", async (req, res) => {
  try {
    const cartQuery = "SELECT * FROM cart";
    const [cartRows] = await connection.promise().execute(cartQuery);

    res.json({ data: cartRows });
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ error: "Database error" });
  }
});

app.post("/addProduct", async (req, res) => {
  try {
    const { product, price, amount, image } = req.body;
    const productQuery =
      "INSERT INTO `cart`(`product`, `amount`, `price`, `image`) VALUES (?,?,?,?)";
    const [results, fields] = await connection
      .promise()
      .execute({ sql: productQuery, values: [product, amount, price, image] });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    // res.sendStatus(500).json({ error: "database error" });
  }
});

app.put("/updateProduct/:productName", async (req, res) => {
  try {
    const { productName: product } = req.params;
    const { price, amount, image } = req.body;
    const updateProductQuery =
      "UPDATE `cart` SET `amount` = ?, `price` = ?, `image` = ? WHERE `product` = ? LIMIT 1";
    const [results, fields] = await connection.promise().execute({
      sql: updateProductQuery,
      values: [amount, price, image, product],
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
});
app.delete("/removeProduct/:productName", async (req, res) => {
  try {
    const { productName } = req.params;
    const deleteProductQuery = "DELETE FROM `cart` WHERE `product` = ? LIMIT 1";
    const [results, fields] = await connection
      .promise()
      .execute({ sql: deleteProductQuery, values: [productName] });

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
});
app.delete("/removeAllProduct", async (req, res) => {
  try {
    const deleteProductQuery = "DELETE FROM cart";
    const [results, fields] = await connection
      .promise()
      .execute(deleteProductQuery);

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`example app listening on port ${PORT}`);
});
