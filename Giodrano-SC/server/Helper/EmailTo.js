const nodemailer = require("nodemailer");
const ejs = require("ejs");

const senderAccount = {
  host: "giordano-dz.com",
  port: 465,
  username: "noreply@giordano-dz.com",
  password: "x8;lWc06U},0",
  // username: "no_reply@dobbiz.com",
  // password: "cIKZ-qAE9pwZ",
};

const emailTo = async (payload, to) => {
  let data;

  if (payload.template_title === "Verification Email")
    data = await ejs.renderFile(
      __dirname + "/templates/email_verification.ejs",
      {
        template_title: payload.template_title,
        user_name: payload.user_name,
        code: payload.code,
      }
    );
  if (payload.template_title === "Numéro de commande")
    data = await ejs.renderFile(__dirname + "/templates/order_number.ejs", {
      template_title: payload.template_title,
      user_name: payload.user_name,
      code: payload.code,
    });
  if (payload.template_title === "Nouvelle commande")
    data = await ejs.renderFile(__dirname + "/templates/new_order.ejs", {
      template_title: payload.template_title,
      code: payload.code,
    });

  if (typeof payload === "string") {
    data = payload;
  }

  return new Promise((resolve) => {
    let transporter = nodemailer.createTransport({
      host: senderAccount.host,
      port: senderAccount.port,
      secure: true,
      auth: {
        user: senderAccount.username,
        pass: senderAccount.password,
      },
    });
    let emailinfos = {
      from: `Giordano ${senderAccount.username}`,
      to,
      subject: payload.template_title || "Email d'un client",
      html: data,
    };
    transporter.sendMail(emailinfos, (error, info) => {
      if (error) {
        console.log(error);
        return resolve(false);
      }
      console.log(info.messageId);
      return resolve(info.messageId);
    });
  });
};

module.exports = emailTo;
