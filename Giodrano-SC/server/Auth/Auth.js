const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../Models/User");

const auth_data = (req, res, next) => {
  let apikey = req.headers["giordano-api-key"];

  if (apikey && apikey === process.env.GIORDANO_API_KEY) {
    next();
  } else {
    if (!apikey) return res.status(401).send({ message: "Missing API KEY" });
    return res.status(401).send({ message: "Invalid API KEY" });
  }
};

const auth_user = async (req, res, next) => {
  let user_token = req.session.user_token;

  if (!user_token) res.status(401).send({ message: "Missing token" });
  else {
    jwt.verify(user_token, process.env.JWT_SECRET, async (err, _user) => {
      if (err) {
        return res.status(401).send({ message: "Invalid token" });
      } else {
        let user = await User.findOne({ _id: _user._id }).exec();
        if (user) {
          req.user = {
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          };
          next();
        } else {
          return res.status(500).send({ message: "Server error" });
        }
      }
    });
  }
};
const check_auth_user = async (req, res, next) => {
  let user_token = req.session.user_token;

  if (!user_token) {
    req.user = {
      _id: "",
    };
    next();
  }
  else {
    jwt.verify(user_token, process.env.JWT_SECRET, async (err, _user) => {
      if (err) {
        return res.status(401).send({ message: "Invalid token" });
      } else {
        let user = await User.findOne({ _id: _user._id }).exec();
        if (user) {
          req.user = {
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          };
          next();
        } else {
          req.user = {
            _id: "",
          };
          next();
        }
      }
    });
  }
};

const user_signup = async (req, res, next) => {
  try {
    let email = req.body.email?.toLowerCase();
    let password = req.body.password;

    if (!(email && password))
      return res.status(401).send({ message: "Missing params" });
    let user = await User.findOne({ email }).exec();

    if (user) return res.status(409).send({ message: "User already exists" });

    password = await bcrypt.hash(password, saltRounds);

    req.user = {
      email,
      password,
    };
    next();
  } catch (err) {
    return res.status(500).send({ message: "Server error" });
  }
};

const user_signin = async (req, res, next) => {
  let email = req.body.email?.toLowerCase();
  let password = req.body.password;

  if (!email || !password)
    return res.status(401).send({ message: "Email or password is empty" });

  try {
    let user = await User.findOne({ email }).exec();

    if (user) {
      let result = await bcrypt.compare(password, user.password);

      if (result) {
        req.user = {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          address: user.address,
          number: user.number,
        };
        next();
      } else return res.status(403).send({ message: "Wrong password" });
    } else {
      return res.status(404).send({ message: "User does not exist" });
    }
  } catch {
    return res.status(404).status({ message: "User does not exist" });
  }
};

module.exports = {
  auth_data,
  auth_user,
  user_signup,
  user_signin,
  check_auth_user
};
