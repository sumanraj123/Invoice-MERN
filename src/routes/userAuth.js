const router = require("express").Router();
const users = require("../models/userAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_KEY, AUTH_USER, AUTH_PASS } = require("../helpers/environment");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

router.post("/register", async (req, res) => {
  try {
    const data = await users.findOne({ email: req.body.email });
    if (!data) {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      await users.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
      });
      
      let userData = await users.findOne({email:req.body.email})

      res.status(200).json({
        message: "User Registration Successfull",
        data:userData,
      });
    } else {
      res.status(400).json({
        message: "Email ID already registered",
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    let data = await users.findOne({ email: req.body.email });
    if (data) {
      let isValid = await bcrypt.compare(req.body.password, data.password);
      if (isValid) {
        //JWT Token generation
        let token = jwt.sign({ email: data.email }, JWT_KEY);

        res.status(200).json({
          message: "Login Successfull",
          token,
          data,
        });
      } else {
        res.status(401).json({
          message: "Invalid Password",
        });
      }
    } else {
      res.status(400).json({
        message: "Email ID not registered. Please Sign up.",
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put("/forgot_password", async (req, res) => {
  try {
    let data = await users.findOne({ email: req.body.email });
    if (data) {
      //Random String Generation
      let randomString = randomstring.generate();

      await users.findOneAndUpdate(
        { email: req.body.email },
        { $set: { randomString } },
        { useFindAndModify: false }
      );

      //Sending password reset link to user mail ID using nodemailer

      let transporter = nodemailer.createTransport({
        service: "gmail",
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: AUTH_USER,
          pass: AUTH_PASS,
        },
      });

      const mailOptions = {
        from: AUTH_USER,
        to: req.body.email,
        subject: "Password Reset Link for Invoice Generator App",
        html: `<p>Click the below link to reset your password</p><a href="%PUBLIC_URL%/auth/forgot_password/${randomString}" target="_blank">Password Reset Link</a>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: "Password Reset Link send to you mail. Please check.",
      });
    } else {
      res.status(404).json({
        message: "Email ID not registered",
      });
    }
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

router.put("/forgot_password/:randomString", async (req, res) => {
  try {
    let data = await users.findOne({ randomString: req.params.randomString });

    if (data) {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      await users.findOneAndUpdate(
        { randomString: req.params.randomString },
        { $set: { password: req.body.password, randomString: "" } },
        { useFindAndModify: false }
      );
      res.send("Password updated successfully");
    } else {
      res.status(404).json({
        message: "Password update failed",
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
