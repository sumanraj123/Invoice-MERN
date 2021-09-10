const invRouter = require("express").Router();
const authorize = require("../helpers/authorize");
const authRole = require("../helpers/authRole");
const invoices = require("../models/invoices");

invRouter.get("/", authorize, async (req, res) => {
  try {
    let data = await invoices.find()
    res.status(200).json({
      message: "Your invoices are here",
      data,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

invRouter.post("/create", authorize, async (req, res) => {
  try {
    await invoices.create({
      client_Name: req.body.client_Name,
      client_Add: req.body.client_Add,
      client_Mob: req.body.client_Mob,
      items: {
        item_Name: req.body.item_Name,
        price: req.body.price,
        quantity: req.body.quantity,
        total_price: req.body.price * req.body.quantity,
      },
      total: req.body.total,
    });
    res.status(200).json({
      message: "Invoice Created successfully",
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

invRouter.put("/update", authorize, async (req, res) => {
  try {
    let data = await invoices.findOne({ invoice_No: req.body.invoice_No });
    if (data) {
      await invoices.findOneAndUpdate(
        { invoice_No: req.body.invoice_No },
        {
          $set: {
            client_Name: req.body.client_Name,
            client_Add: req.body.client_Add,
            client_Mob: req.body.client_Mob,
            total: req.body.total,
          },
          $push: {
            items: {
              item_Name: req.body.item_Name,
              price: req.body.price,
              quantity: req.body.quantity,
              total_price: req.body.price * req.body.quantity,
            },
          },
        },
        { useFindAndModify: false }
      );
      res.status(200).json({
        message: "Invoice Updated Successfully",
      });
    } else {
      res.status(404).json({
        message: "No data Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

invRouter.delete("/delete", authorize, authRole, async (req, res) => {
  try {
    let data = await invoices.findOne({ invoice_No: req.body.invoice_No });
    if (data) {
      await invoices.deleteOne({ invoice_No: req.body.invoice_No });
      res.status(200).json({
        message: "Invoice deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No data Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = invRouter;
