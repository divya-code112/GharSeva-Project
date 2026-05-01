const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lawanddivya@gmail.com",
      pass: skjrcibycychkzmb
    }
  });

  await transporter.sendMail({
    from: "GharSeva <yourmail@gmail.com>",
    to,
    subject,
    html
  });
};

module.exports = sendMail;