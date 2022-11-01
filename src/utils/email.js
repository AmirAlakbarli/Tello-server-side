const nodemailer = require("nodemailer");
const pug = require("pug");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = process.env.EMAIL_FROM;
    this.firstName = user.name;
    this.url = url;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Tello Family!");
  }

  async sendResetPassword() {
    await this.send("reset", "Please Reset Password!");
  }
}

module.exports = Email;
