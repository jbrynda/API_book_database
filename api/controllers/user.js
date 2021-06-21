const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signUp = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1)
        return res.status(422).json({ msg: "Email already in use" });
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err });
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              msg: "User created",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      });
    });
};

exports.signIn = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) return res.status(401).json({ msg: "Auth Failed" });
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) return res.status(401).json({ msg: "Auth Failed" });
        if (result) {
          const token = jwt.sign(
            //prihlaseni uzivatele
            {
              email: user[0].email,
              usedId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({ msg: "Auth successful", token: token });
        }
        res.status(401).json({ msg: "Auth Failed" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteUser = (req, res, next) => {
  //pouziti nutnosti priglaseni
  //mazani uzivatele. test v 5:05 11.3.
  User.remove({ _id: req.params.usedId })
    .exec()
    .then((result) => {
      res.status(200).json({
        msg: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
