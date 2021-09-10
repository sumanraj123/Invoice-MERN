const mongoose = require("mongoose");
const { DB_URL, PORT } = require("./environment");

const connectDB = new Promise((resolve, reject) => {
  try {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    resolve(PORT);
  } catch (err) {
    console.log(err);
    reject(err);
  }
});

module.exports = connectDB;
