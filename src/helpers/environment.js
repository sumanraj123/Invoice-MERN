const dotenv = require("dotenv").config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;
const JWT_KEY = process.env.JWT_KEY;
const AUTH_USER = process.env.AUTH_USER;
const AUTH_PASS = process.env.AUTH_PASS;

module.exports = { DB_URL, PORT, JWT_KEY, AUTH_USER, AUTH_PASS };
