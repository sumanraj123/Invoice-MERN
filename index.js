const express = require("express");
const cors = require("cors");
const connectDB = require("./src/helpers/connection");
const router = require("./src/routes/userAuth");
const authorize = require("./src/helpers/authorize");
const invRouter = require("./src/routes/invoices");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", router);
app.use("/invoices", invRouter);

app.get("/", authorize, async (req, res) => {
  res.send("Hello WOrld!!!!");
});

connectDB
  .then((port) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
