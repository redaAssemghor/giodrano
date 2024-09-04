const express = require("express");
const router = express.Router();
const {
  auth_data,
  auth_user,
  user_signup,
  user_signin,
} = require("../Auth/Auth");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

router.post("/api/v1/user-signup", auth_data, user_signup, async (req, res) => {
  try {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.user.email;
    let password = req.user.password;
    let address = req.body.address;
    let address_prov = req.body.address_prov;
    let address_city = req.body.address_city;
    let address_postal_code = req.body.address_postal_code;
    let number = req.body.number;

    if (
      !(
        first_name &&
        last_name &&
        email &&
        password &&
        address &&
        address_city &&
        address_postal_code &&
        address_prov &&
        number
      )
    )
      return res.status(401).send({ message: "Missing params" });

    let new_user = new User({
      first_name,
      last_name,
      email,
      password,
      address: {
        address,
        prov: address_prov,
        city: address_city,
        postal_code: address_postal_code,
      },
      number,
    });

    let saved_user = await new_user.save();
    req.session.user_token = jwt.sign(
      {
        _id: new_user._id,
        email: new_user.email,
        first_name: new_user.first_name,
        last_name: new_user.last_name,
      },
      process.env.JWT_SECRET
    );
    res.send({
      _id: new_user._id,
      email: new_user.email,
      first_name: new_user.first_name,
      last_name: new_user.last_name,
      address: new_user.address,
      number: new_user.number,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/api/v1/user-signin", auth_data, user_signin, async (req, res) => {
  try {
    req.session.user_token = jwt.sign(
      {
        _id: req.user._id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
      },
      process.env.JWT_SECRET
    );

    res.send({
      _id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      address: req.user.address,
      number: req.user.number,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error" });
  }
});

router.get("/api/v1/user-online", auth_data, auth_user, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id });
    res.send({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,
      number: user.number,
    });
  } catch (err){
    console.log(err)
    res.status(500).send({ message: "error" });
  }
});

router.get("/api/v1/user-logout", auth_data, auth_user, async (req, res) => {
  delete req.session.user_token;
  res.send({ messgae: "user is logged out" });
});

module.exports = router;
