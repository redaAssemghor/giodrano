const express = require("express");
const router = express.Router();
const { auth_data, auth_user, check_auth_user } = require("../Auth/Auth");
const axios = require("axios");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("123456789", 5);
const nanoidOrder = customAlphabet("123456789", 10);
const emailTo = require("../Helper/EmailTo");
const bcrypt = require("bcrypt");
const Item = require("../Models/Item");
const Order = require("../Models/Order");
const Settings = require("../Models/Settings");
const dotenv = require("dotenv");
const saltRounds = 10;
dotenv.config();

const axiosInstance = axios.create();

axiosInstance.defaults.headers["X-API-ID"] = process.env.YAL_API_ID;
axiosInstance.defaults.headers["X-API-TOKEN"] = process.env.YAL_API_TOKEN;

router.put("/api/v1/user", auth_data, auth_user, async (req, res) => {
  try {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email?.toLowerCase();
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
        address &&
        address_city &&
        address_postal_code &&
        address_prov &&
        number
      )
    )
      return res.status(401).send({ message: "Missing params" });

    let updated_user = await User.updateOne(
      { _id: req.user._id },
      {
        first_name,
        last_name,
        email,
        address: {
          address,
          prov: address_prov,
          city: address_city,
          postal_code: address_postal_code,
        },
        number,
      }
    );

    req.session.user_token = jwt.sign(
      {
        _id: req.user._id,
        email: email,
        first_name: first_name,
        last_name: last_name,
      },
      process.env.JWT_SECRET
    );
    res.send({
      _id: req.user._id,
      email: email,
      first_name: first_name,
      last_name: last_name,
      address: {
        address,
        prov: address_prov,
        city: address_city,
        postal_code: address_postal_code,
      },
      number: number,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/api/v1/password-reset/step-1", auth_data, async (req, res) => {
  try {
    let email = req.body.email;
    if (!email) return res.status(401).send({ message: "Missing param" });

    let user = await User.findOne({ email });

    if (!user) return res.status(404).send({ message: "User not found" });

    req.session.pwr_email = email;
    req.session.pwr_code = nanoid();

    let payload = {
      template_title: "Verification Email",
      user_name: user.first_name + " " + user.last_name,
      code: req.session.pwr_code,
    };
    let email_status = await emailTo(payload, email);

    res.send({ message: "Code was sent!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/api/v1/password-reset/step-2", auth_data, async (req, res) => {
  try {
    let code = req.body.code;
    if (!code) return res.status(401).send({ message: "Missing param" });

    if (code === req.session.pwr_code) {
      return res.send({ message: "Request is allowed" });
    }
    res.status(403).send({ message: "Wrong password" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});
router.post("/api/v1/password-reset/step-3", auth_data, async (req, res) => {
  try {
    let password = req.body.password;
    if (!password) return res.status(401).send({ message: "Missing param" });

    let hashed_password = await bcrypt.hash(password, saltRounds);
    let updated_user = await User.updateOne(
      { email: req.session.pwr_email },
      {
        password: hashed_password,
      }
    );

    res.send({ message: "password is changed!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});
router.post(
  "/api/v1/user/password-reset",
  auth_data,
  auth_user,
  async (req, res) => {
    try {
      let old_password = req.body.old_password;
      let new_password = req.body.new_password;

      if (!(old_password && new_password))
        return res.status(401).send({ message: "Missing param" });

      let user = await User.findOne({ _id: req.user._id });

      let is_oldpw_alike = await bcrypt.compare(old_password, user.password);

      if (is_oldpw_alike) {
        let hashed_password = await bcrypt.hash(new_password, saltRounds);
        let updated_user = await User.updateOne(
          { _id: req.user._id },
          {
            password: hashed_password,
          }
        );
        return res.send({ message: "password is changed!" });
      }
      res.status(403).send({ message: "Wrong password" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);
router.get("/api/v1/cover", auth_data, async (req, res) => {
  try {
    let cover = await Settings.findOne();
    console.log(cover);
    res.send(cover);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/api/v1/items", auth_data, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 0;
    let el_per_page = parseInt(req.query.el_per_page) || 18;
    let category = req.query.category;
    let superset = req.query.superset;
    let subset = req.query.subset;
    let sort_by = req.query.sort_by
      ? JSON.parse(req.query.sort_by)
      : { sort_by: "added_date", order: -1 };
    let search = req.query.search;

    // UPDATE Build the query object
    const query = {};

    // UPDATE Add search condition if search query is provided
    if (search) {
      query.entitle = { $regex: search, $options: "i" };
    }

    if (category) query.category = category;
    if (superset) query.superset = superset;
    if (subset) query.subset = subset;

    const totalItems = await Item.find(query).countDocuments();
    const items = await Item.find(query)
      .skip(el_per_page * page)
      .limit(el_per_page)
      .sort({ [sort_by.sort_by]: sort_by.order });

    res.send({ total: totalItems, items });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error" });
  }
});

router.get("/api/v1/items/:id", auth_data, async (req, res) => {
  try {
    let _id = req.params.id;

    if (!_id) return res.status(403).send({ message: "Missing param" });

    let item = await Item.findOne(
      { _id },
      {
        _id: "$_id",
        item_ref: "$item_ref",
        category: "$category",
        superset: "$superset",
        subset: "$subset",
        entitle: "$entitle",
        price: "$price",
        discount: "$discount",
        description: "$description",
        imgs: "$imgs",
        new_arrival: "$new_arrival",
        stock: "$stock",
        added_date: "$added_date",
      }
    );
    if (!item) return res.status(404).send({ message: "Item does not exist" });

    res.send(item);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.put("/api/v1/cart", auth_data, async (req, res) => {
  try {
    let cart = req.session.cart || [];
    let item = req.body.item;

    if (!item && !item._id && !item.color && !item.size && !item.qnt)
      return res.status(403).send({ message: "Missing params" });

    let index = cart.findIndex((item_) => item_._id === item._id);

    if (index !== -1) {
      cart[index].color = item.color;
      cart[index].size = item.size;
      cart[index].qnt = item.qnt;
      cart[index].avStock = item.avStock;

      req.session.cart = Array.from(cart);
      let fullCart = await getFullCartInfo(cart);
      return res.send({ message: "Item was updated", cart: fullCart });
    }

    cart.push({
      _id: item._id,
      color: item.color,
      size: item.size,
      qnt: item.qnt,
      avStock: item.avStock,
    });
    req.session.cart = Array.from(cart);
    let fullCart = await getFullCartInfo(cart);

    return res.send({ message: "Item was added", cart: fullCart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.delete("/api/v1/cart", auth_data, async (req, res) => {
  try {
    let cart = req.session.cart || [];
    let item = req.query.item;

    if (!item) return res.status(403).send({ message: "Missing params" });

    let index = cart.findIndex((item_) => item_._id === item._id);

    if (index !== -1) {
      cart.splice(index, 1);
      req.session.cart = Array.from(cart);
      let fullCart = await getFullCartInfo(cart);
      return res.send({ message: "Item was updated", cart: fullCart });
    }
    let fullCart = await getFullCartInfo(cart);

    return res.send({ message: "Cart is empty", cart: fullCart });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/api/v1/cart", auth_data, async (req, res) => {
  try {
    let fullCart = req.session.cart
      ? await getFullCartInfo(req.session.cart)
      : [];

    res.send(fullCart);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});
router.post("/api/v1/order", auth_data, check_auth_user, async (req, res) => {
  try {
    let fullCart = req.session.cart
      ? await getFullCartInfo(req.session.cart)
      : [];
    let order_number = nanoidOrder();
    let cart = fullCart.map((item) => {
      return {
        _id: item._id,
        size: item.size,
        color: item.color,
        price: item.discount || item.price,
        qnt: item.qnt,
      };
    });
    let shipping_fees = req.body.shipping_fees || 0;
    let user_id = req.user?._id || "";
    let prov = req.body.prov;
    let city = req.body.city;
    let postal_code = req.body.postal_code;
    let address = req.body.address;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let number = req.body.number;
    let email = req.body.email;

    if (cart.length === 0)
      return res.status(403).send({ message: "Cart is empty" });
    if (
      !prov &&
      !city &&
      !postal_code &&
      !address &&
      !first_name &&
      !last_name &&
      !number &&
      !email
    )
      return res.status(403).send({ message: "Missing params" });

    let new_order = new Order({
      order_number,
      cart,
      shipping_fees,
      user_id,
      shipping_address: { prov, city, postal_code, address },
      first_name,
      last_name,
      number,
      email,
    });
    let payload = {
      template_title: "Numéro de commande",
      user_name: req.user.first_name + " " + req.user.last_name,
      code: order_number,
    };
    let payload_2 = {
      template_title: "Nouvelle commande",
      code: order_number,
    };
    let saved_new_order = await new_order.save();
    let email_status = emailTo(payload, email);
    let email_status_2 = emailTo(payload_2, "notifications@giordano-dz.com");
    delete req.session.cart;
    res.send({ message: "Order is saved" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/api/v1/orders", auth_data, auth_user, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).sort({
      added_date: -1,
    });

    res.send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});
router.get("/api/v1/orders/:order_number", auth_data, async (req, res) => {
  try {
    const order = await Order.findOne({
      order_number: req.params.order_number,
    });
    if (order) return res.send(order);
    return res.status(404).send({ message: "Order not found" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.get("/api/v1/orders-item", auth_data, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.query._id });

    const cart = await Promise.all(
      order.cart.map(async (item) => {
        let data = await Item.findOne(
          { _id: item._doc._id },
          {
            imgs: "$imgs",
            _id: "$_id",
            entitle: "$entitle",
          }
        );

        return {
          img: data.imgs[0],
          entitle: data.entitle,
          ...item._doc,
        };
      })
    );
    let fullOrder = { ...order._doc, cart };

    res.send(fullOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.post("/api/v1/email-form", auth_data, async (req, res) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let subject = req.body.subject;
    let number = req.body.number;
    let message = req.body.message;

    const body = `
    <p>Nom: </p>
    <p>${name}</p>
    <p>Email: </p>
    <p>${email}</p>
    <p>Numéro: </p>
    <p>${number}</p>
    <p>Sujet: </p>
    <p>${subject}</p>
    <p>Message: </p>
    <p>${message}</p>
    `;

    let result = await emailTo(body, "contact@giordano-dz.com");

    if (result) {
      return res.send({ message: "Message sent" });
    }
    return res.status(500).send({ message: "Message not sent" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error" });
  }
});

router.get("/api/v1/track", auth_data, async (req, res) => {
  try {
    let order_number = req.query.order_number;
    if (!order_number)
      return res.status(401).send({ message: "Missing params" });
    let order = await Order.findOne({ order_number });

    if (!order)
      return res.status(404).send({ message: "Order does not exist" });

    if (!order.shipping_ref)
      return res
        .status(403)
        .send({ message: "Order does not have a shipping reference" });

    let data = await axiosInstance.get(
      "https://api.yalidine.app/v1/histories/" + order.shipping_ref
    );

    res.send(data.data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

const getFullCartInfo = async (cart) => {
  try {
    let tempCart = await Promise.all(
      cart.map(async (item) => {
        let tempItem = await Item.findOne(
          { _id: item._id },
          {
            img: { $arrayElemAt: ["$imgs", 0] },
            _id: "$_id",
            entitle: "$entitle",
            price: "$price",
            discount: "$discount",
          }
        );

        return {
          ...tempItem._doc,
          ...item,
        };
      })
    );
    return tempCart;
  } catch (err) {
    return [];
  }
};

module.exports = router;
