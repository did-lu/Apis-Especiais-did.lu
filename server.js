const path = require("path");
const express = require("express");
require("dotenv").config();

const routes = require("./routes.js");

const PORT = process.env.PORT || 3000;

const app = express();
var bodyParser = require("body-parser");
const { json } = require("body-parser");
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(routes);
