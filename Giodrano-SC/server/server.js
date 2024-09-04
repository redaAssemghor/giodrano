const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const fileupload = require("express-fileupload");
const path = require("path");
const Login = require("./Routes/Login")
const User = require("./Routes/User")
const Admin = require("./Routes/Admin")

const PORT = process.env.PORT || 9500;

dotenv.config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", console.error.bind(console, "Error"));
mongoose.connection.on("open", () => {
  console.log("Connection is established");
});

app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(fileupload());

app.use(
  session({
    genid: (req) => {
      return nanoid(32);
    },
    resave: false,
    saveUninitialized: false,
    proxy: true,
    HttpOnly: true,
    cookie: {
      secure: false,
      // maxAge: 10000000000
      // maxAge: 180 * 60 * 1000
    },
    // rolling: true,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

/* routes */

app.use("/", Login);
app.use("/", User);
app.use("/", Admin);
// app.use("/", Tenant);
// app.use("/", Host);
// app.use("/", Payment);
// app.use("/", Admin);


if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

app.listen(PORT);
