const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
const { DB_URL } = require("../helpers/environment");

const connection = mongoose.createConnection(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
autoIncrement.initialize(connection);

const invoiceSchema = new Schema({
  invoice_No: {
    type: Number,
    require: true,
  },
  created_Date: {
    type: Date,
    require: true,
    default: new Date(),
  },
  client_Name: {
    type: String,
    require: true,
  },
  client_Add: {
    type: String,
    require: true,
  },
  client_Mob: {
    type: Number,
  },
  items: [{
  item_Name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  total_price: {
    type: Number,
    require: true,
  },}],
  total: {
    type: Number,
    require: true,
  },
});

invoiceSchema.plugin(autoIncrement.plugin, {
  model: "invoices",
  field: "invoice_No",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("invoices", invoiceSchema);
