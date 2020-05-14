const express = require('express')

const mongoose = require('mongoose');

const session = require("express-session");


const app = express();


app.use(express.json());
app.use (
  session ({
      secret: "53cr3t50m3th1ng",
      resave: true,
      rolling: true,
      saveUninitialized: false,
      cookie: {
          maxAge: 30 * 1000
      }
  })
);

const User = require('./model/user');

const bcrypt = require("bcrypt");


const nodemailer = require("nodemailer");

mongoose.connect('mongodb://username:password@ds161134.mlab.com:61134/signup_otp', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (req, res) => {
  console.log("Connected to database");
})

app.post('/signup', (req, res) => {
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length >= 1) {
        return res.json({
          message: "Mail exists"
        });
      } else {
    let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shainsha24041999@gmail.com',
      pass: "kaetcsvxhtuhszpk"
    },
    tls: {
      rejectUnauthorized: false,
    }
  });
  let otpValue = Math.floor(100000 + Math.random() * 9000);
  const newUser = new User({
    fname: req.body.firstname,
    lname: req.body.lastname,
    email: req.body.email,
    otp: otpValue,
    status: "pending",
    password: ''
  })
  
  try {
    newUser.save();
    // mongoose.save(newUser);
    res.send("Sign up successful");
  } catch (err) {
    console.log(err)
  }
  let mailOptions = {
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




    }
  });
}
    })



})


app.post('/verify', (req, res) => {
  if(req.body.password != req.body.password2){
    return res.json({
      message:"Passowrd did not match"
    })
}

if(req.body.password.length < 4 ){
 return res.json({
   message:"password must be atleast 4 characters"
 })
}
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.json({
        error: err
      });
    }

    User.findOneAndUpdate({ otp: parseInt(req.body.otp) }, { $set: { status: "Success", password: hash }, $unset: { otp: 1 } }, { new: true }, (err, doc) => {

      if (doc == null) {
        res.send("Wrong otp")
      }
      else {
        res.send(doc);
      }

    });

  })
})

app.post("/login", (req, res) => {
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length < 1) {
        return res.json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result && user[0].status == 'Successs') {
          req.session.userId = user[0]._id
          return res.json({
            message: "Auth successful",
          });
        }else{
        res.json({
          message: "Otp not verified"
        });
      }
      });
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.listen(3000, () => {
  console.log("Server port running on 3000");
})