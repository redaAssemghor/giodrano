const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../Models/Admin");

const auth_admin = async (req, res, next) => {
  let admin_token = req.session.admin_token;

  if (!admin_token) res.status(401).send({ message: "Missing token" });
  else {
    jwt.verify(admin_token, process.env.JWT_SECRET, async (err, _admin) => {
      if (err) {
        return res.status(401).send({ message: "Invalid token" });
      } else {
        let admin = await Admin.findOne({ _id: _admin._id }).exec();
        if (admin) {
          req.admin = {
            _id: admin._id,
            email: admin.email,
          };
          next();
        } else {
          return res.status(500).send({ message: "Server error" });
        }
      }
    });
  }
};

const admin_signin = async (req, res, next) => {
  let email = req.body.email?.toLowerCase();
  let password = req.body.password;

  if (!email || !password)
    return res.status(401).send({ message: "Email or password is empty" });

  try {
    let admin = await Admin.findOne({ email }).exec();

    if (admin) {
      let result = await bcrypt.compare(password, admin.password);

      if (result) {
        req.admin = {
          _id: admin._id,
          email: admin.email,
        };
        next();
      } else return res.status(403).send({ message: "Wrong password" });
    } else {
      return res.status(404).send({ message: "admin does not exist" });
    }
  } catch {
    return res.status(404).status({ message: "admin does not exist" });
  }
};

module.exports = {
  auth_admin,
  admin_signin,
};
