const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  randomString: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    require: true,
    // default: "Employee",
  },
});

module.exports = mongoose.model("users", usersSchema);
