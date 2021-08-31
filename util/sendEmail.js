const sendEmail = require("./nodemailer")

const verifyemail = function (email, subject, message) {
  try {
    sendEmail({
      email: email,
      subject: subject,
      message: message,
    })
    console.log("message sent")
    return "success"
  } catch (err) {
    console.log(err)
    return "failure"
  }
}

module.exports = verifyemail
