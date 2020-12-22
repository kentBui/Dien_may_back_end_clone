const nodeMailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    // 1] create transporter
    const transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // use mailtrap.io

    // 2] define the mail options
    const mailOptions = {
      from: "host@my-app-host.com",
      to: options.email,
      subject: options.subject,
      text: options.text,
    };

    // 3] send mail

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
