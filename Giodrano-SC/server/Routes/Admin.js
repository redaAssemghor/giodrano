const express = require("express");
const router = express.Router();
const { auth_data } = require("../Auth/Auth");
const { auth_admin, admin_signin } = require("../Auth/Auth_admin");
const Admin = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const { uploadFiles, uploadFile, deleteFile } = require("../Helper/FileUpload");
const Item = require("../Models/Item");
const Order = require("../Models/Order");
const User = require("../Models/User");
const Settings = require("../Models/Settings");
const bcrypt = require("bcrypt");
const emailTo = require("../Helper/EmailTo");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("123456789", 5);
const saltRounds = 10;
router.post(
  "/api/v1/_admin_/admin-signin",
  auth_data,
  admin_signin,
  async (req, res) => {
    try {
      req.session.admin_token = jwt.sign(
        {
          _id: req.admin._id,
          email: req.admin.email,
        },
        process.env.JWT_SECRET
      );
      let cover = await Settings.findOne();
      res.send({
        _id: req.admin._id,
        email: req.admin.email,
        cover: cover.cover,
        cover_updated: cover.added_date,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "error" });
    }
  }
);

router.get(
  "/api/v1/_admin_/admin-online",
  auth_data,
  auth_admin,
  async (req, res) => {
    try {
      let [admin, cover] = await Promise.all([
        Admin.findOne({ _id: req.admin._id }),
        Settings.findOne(),
      ]);
      res.send({
        _id: admin._id,
        email: admin.email,
        cover: cover.cover,
        cover_updated: cover.added_date,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "error" });
    }
  }
);

router.get(
  "/api/v1/_admin_/admin-logout",
  auth_data,
  auth_admin,
  async (req, res) => {
    delete req.session.admin_token;
    res.send({ messgae: "admin is logged out" });
  }
);

router.get(
  "/api/v1/_admin_/items/:id",
  auth_data,
  auth_admin,
  async (req, res) => {
    try {
      let _id = req.params.id;

      if (!_id) return res.status(403).send({ message: "Missing param" });

      let item = await Item.findOne({ _id });
      if (!item)
        return res.status(404).send({ message: "Item does not exist" });

      res.send(item);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);
router.delete(
  "/api/v1/_admin_/items/:id",
  auth_data,
  auth_admin,
  async (req, res) => {
    try {
      let _id = req.params.id;

      if (!_id) return res.status(403).send({ message: "Missing param" });

      let item = await Order.findOne({ "cart._id": _id });
      
      if (item)
        return res.status(409).send({ message: "You can't delete this item" });

      let item_ = await Item.findOne({ _id });

      let deletion = item_.imgs.map((img) => {
        deleteFile(img);
      });

      let deleted_item = await Item.deleteOne({ _id });

      res.send({ message: "Item was deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);

router.post("/api/v1/_admin_/item", auth_data, auth_admin, async (req, res) => {
  try {
    let item_ref = req.body.item_ref;
    let category = req.body.category;
    let superset = req.body.superset;
    let subset = req.body.subset;
    let entitle = req.body.entitle;
    let price = req.body.price;
    let discount = req.body.discount === "NaN" || 0;
    let files = req.files;
    let new_arrival = req.body.new_arrival || false;
    let stock = [req.body.stock].flat(1).map((item) => JSON.parse(item));

    if (
      !item_ref &&
      !category &&
      !superset &&
      !entitle &&
      !price &&
      stock.length === 0
    )
      return res.status(401).send({ message: "Missing params" });

    let imgs = await uploadFiles(files.file, "articles", item_ref);
    if (imgs === false) {
      return res.status(500).send({ message: "error" });
    }
    let newItem = new Item({
      item_ref,
      entitle,
      imgs,
      category,
      superset,
      subset,
      price,
      discount,
      new_arrival,
      stock,
    });

    let savedItem = await newItem.save();

    res.send({ message: "new item is saved!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error" });
  }
});
router.put("/api/v1/_admin_/item", auth_data, auth_admin, async (req, res) => {
  try {
    let item_id = req.body.item_id;
    let item_ref = req.body.item_ref;
    let category = req.body.category;
    let superset = req.body.superset;
    let subset = req.body.subset;
    let entitle = req.body.entitle;
    let description = req.body.description;
    let price = req.body.price;
    let discount = req.body.discount === "NaN" ? 0 : req.body.discount;
    let files = req.files;
    let new_arrival = req.body.new_arrival || false;
    let stock = [req.body.stock].flat(1).map((item) => JSON.parse(item));
    let old_imgs = [req.body.imgs]
      .flat(1)
      .filter((item) => !item.includes("blob:"));

    // return;
    if (
      !item_id &&
      !item_ref &&
      !category &&
      !superset &&
      !entitle &&
      !price &&
      stock.length === 0
    )
      return res.status(401).send({ message: "Missing params" });

    let imgs = files?.file
      ? await uploadFiles(files.file, "articles", item_ref)
      : [];
    if (imgs === false) {
      return res.status(500).send({ message: "error" });
    }
    let newItem = await Item.updateOne(
      { _id: item_id },
      {
        item_ref,
        entitle,
        imgs: [...old_imgs, ...imgs],
        category,
        superset,
        subset,
        price,
        discount,
        new_arrival,
        stock,
        description,
      }
    );

    res.send({ message: "new item is saved!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error" });
  }
});

router.get("/api/v1/_admin_/items", auth_data, auth_admin, async (req, res) => {
  try {
    let page = req.query.page || 0;
    let el_per_page = req.query.el_per_page || 12;

    let [totalItems, items] = await Promise.all([
      Item.find().countDocuments(),
      Item.find()
        .skip(el_per_page * page)
        .limit(el_per_page).sort({added_date: -1}),
    ]);

    res.send({ total: totalItems, items });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error" });
  }
});

router.get("/api/v1/_admin_/users", auth_data, auth_admin, async (req, res) => {
  try {
    let page = req.query.page || 0;
    let el_per_page = req.query.el_per_page || 12;
    const [users, totalUsers] = await Promise.all([
      User.find()
        .skip(page * el_per_page)
        .limit(el_per_page)
        .sort({
          added_date: -1,
        }),
      User.find().countDocuments(),
    ]);
    res.send({ users, total: totalUsers });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});
router.get(
  "/api/v1/_admin_/orders",
  auth_data,
  auth_admin,
  async (req, res) => {
    try {
      let page = req.query.page || 0;
      let el_per_page = req.query.el_per_page || 12;
      const [orders, totalOrders] = await Promise.all([
        Order.find()
          .skip(page * el_per_page)
          .limit(el_per_page)
          .sort({
            added_date: -1,
          }),
        Order.find().countDocuments(),
      ]);

      res.send({ orders, total: totalOrders });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);
router.put(
  "/api/v1/orders/shipping-ref",
  auth_data,
  auth_admin,
  async (req, res) => {
    try {
      let order_id = req.body.order_id;
      let ref = req.body.ref || "";

      if (!order_id) return res.status(403).send({ message: "Missing params" });

      let order = await Order.updateOne(
        { _id: order_id },
        { shipping_ref: ref }
      );

      res.send({ message: "Order was updated" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);
router.put("/api/v1/orders/status", auth_data, auth_admin, async (req, res) => {
  try {
    let order_id = req.body.order_id;
    let action = req.body.action || "";

    if (!order_id && !["confirmed", "canceled", "returned"].includes(action))
      return res
        .status(403)
        .send({ message: "Params are either missing or hold a falty value" });

    let old_order = await Order.findOne({ _id: order_id });
    if (!old_order) return res.status(404).send({ message: "Order not found" });

    if (action === "canceled") {
      let order = await Order.updateOne({ _id: order_id }, { status: action });
    }
    if (action === "confirmed") {
      let searched_items = old_order.cart.map((item) => item._id);
      let items = await Item.find({ _id: { $in: searched_items } });
      let temp_items = Array.from(items);
      let updates = await Promise.all(
        temp_items.map(async (item) => {
          let old_order_item = old_order.cart.find(
            (_item) => _item._id === item._id.toString()
          );
          let temp_stock = Array.from(item.stock);
          let stock_index = temp_stock.findIndex(
            (color) => color.color === old_order_item.color
          );

          let index = temp_stock[stock_index].sizes.findIndex(
            (size) => size.size === old_order_item.size
          );

          temp_stock[stock_index].sizes[index].qnt = Math.max(
            0,
            temp_stock[stock_index].sizes[index].qnt - old_order_item.qnt
          );

          let update_item = await Item.updateOne(
            { _id: item._id },
            {
              stock: temp_stock,
              all_time_purchase: item.all_time_purchase + old_order_item.qnt,
            }
          );

          return true;
        })
      );

      let order = await Order.updateOne({ _id: order_id }, { status: action });
    }
    if (action === "returned") {
      let searched_items = old_order.cart.map((item) => item._id);
      let items = await Item.find({ _id: { $in: searched_items } });
      let temp_items = Array.from(items);
      let updates = await Promise.all(
        temp_items.map(async (item) => {
          let old_order_item = old_order.cart.find(
            (_item) => _item._id === item._id.toString()
          );
          let temp_stock = Array.from(item.stock);
          let stock_index = temp_stock.findIndex(
            (color) => color.color === old_order_item.color
          );

          let index = temp_stock[stock_index].sizes.findIndex(
            (size) => size.size === old_order_item.size
          );

          temp_stock[stock_index].sizes[index].qnt =
            temp_stock[stock_index].sizes[index].qnt + old_order_item.qnt;

          let update_item = await Item.updateOne(
            { _id: item._id },
            {
              stock: temp_stock,
              all_time_purchase: Math.max(
                0,
                item.all_time_purchase - old_order_item.qnt
              ),
            }
          );

          return true;
        })
      );

      let order = await Order.updateOne({ _id: order_id }, { status: action });
    }

    res.send({ message: "Order was updated" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.post(
  "/api/v1/_admin_/settings",
  auth_data,
  auth_admin,
  async (req, res) => {
    try {
      let file = req.files;

      if (!file) return res.status(403).send({ message: "Missing file" });

      let cover = await uploadFile(file, "giordano", "par");

      let settings = await Settings.updateOne(
        {},
        { cover, added_date: new Date() }
      );

      res.send({ cover, cover_updated: new Date() });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);

router.post(
  "/api/v1/_admin_/password-reset",
  auth_data,
  auth_admin,
  async (req, res) => {
    try {
      let old_password = req.body.old_password;
      let new_password = req.body.new_password;

      if (!(old_password && new_password))
        return res.status(401).send({ message: "Missing param" });

      let admin = await Admin.findOne();

      let is_oldpw_alike = await bcrypt.compare(old_password, admin.password);

      if (is_oldpw_alike) {
        let hashed_password = await bcrypt.hash(new_password, saltRounds);
        let updated_admin = await Admin.updateOne(
          {},
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

router.put("/api/v1/_admin_/admin", auth_data, auth_admin, async (req, res) => {
  try {
    let email = req.body.email?.toLowerCase();

    if (!email) return res.status(401).send({ message: "Missing params" });

    let updated_admin = await Admin.updateOne(
      {},
      {
        email,
      }
    );
    let cover = await Settings.findOne();
    req.session.admin_token = jwt.sign(
      {
        _id: req.admin._id,
        email: email,
      },
      process.env.JWT_SECRET
    );
    res.send({
      _id: req.admin._id,
      email: email,
      cover: cover.cover,
      cover_updated: cover.added_date,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.post(
  "/api/v1/_admin_/password-reset/step-1",
  auth_data,
  async (req, res) => {
    try {
      let email = req.body.email;
      if (!email) return res.status(401).send({ message: "Missing param" });

      let admin = await Admin.findOne({ email });

      if (!admin) return res.status(404).send({ message: "Admin not found" });

      req.session.admin_pwr_email = email;
      req.session.admin_pwr_code = nanoid();

      let payload = {
        template_title: "Verification Email",
        user_name: admin.first_name + " " + admin.last_name,
        code: req.session.admin_pwr_code,
      };
      let email_status = await emailTo(payload, email);

      res.send({ message: "Code was sent!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);

router.post(
  "/api/v1/_admin_/password-reset/step-2",
  auth_data,
  async (req, res) => {
    try {
      let code = req.body.code;
      if (!code) return res.status(401).send({ message: "Missing param" });

      if (code === req.session.admin_pwr_code) {
        return res.send({ message: "Request is allowed" });
      }
      res.status(403).send({ message: "Wrong password" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);
router.post(
  "/api/v1/_admin_/password-reset/step-3",
  auth_data,
  async (req, res) => {
    try {
      let password = req.body.password;
      if (!password) return res.status(401).send({ message: "Missing param" });

      let hashed_password = await bcrypt.hash(password, saltRounds);
      let updated_admin = await Admin.updateOne(
        { email: req.session.admin_pwr_email },
        {
          password: hashed_password,
        }
      );

      res.send({ message: "password is changed!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }
);

module.exports = router;
