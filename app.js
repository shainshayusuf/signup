const express = require('express')

const mongoose = require('mongoose');

const app = express();


app.use(express.json());

const User = require('./model/user');





const nodemailer = require("nodemailer");

app.post('/signup', (req, res) => {
  console.log(req.body.email)



  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shainsha24041999@gmail.com',
      pass: "kaetcsvxhtuhszpk"
    },
    tls: {
      rejectUnauthorized: false,
    }
  });
  let otpValue = Math.floor(1000 + Math.random() * 9000);
  const newUser = new User({
    fname: req.body.firstname,
    lname: req.body.lastname,
    email: req.body.email,
    otp: otpValue,
    status: "pending",
    password: ''
  })
  res.send(newUser);
  try {
    newUser.save();
  } catch (err) {
    console.log(err)
  }
  var mailOptions = {
    from: 'shainsha24041999@gmail.com',
    to: req.body.email,
    //to: 'linguisticsresearch@phoenicorn.com',
    subject: 'Otp for Confirmation',
    text: `Dear ${req.body.firstname},Otp for your confirmation is ${otpValue}`,

    //attachments:[{filename:newname}]
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      // res.send("somthing went wrong")

    } else {
      console.log('Email sent: ' + info.response);

      // res.send("Thank you for your response ")
      // return res.render("file:///C:/Users/ACAL/Desktop/Natours/contact.html");


    }
  });



})
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://firstDB:<Shainsha@123>@cluster0-a2ozx.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (req, res) => {
  console.log("Connected to database");
})

app.listen(3000, () => {
  console.log("Server port running on 3000");
})